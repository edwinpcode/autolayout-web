import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { getReference } from "../../../Services/AutoLayoutService"
import {
  removeHiddenField,
  setHiddenField,
} from "../../../Store/HiddenElement/hiddenElementSlice"
import { resetDropdown, setDropdown } from "../../../Store/Input/DropdownSlice"
import { handleConditionValue } from "../../../Utils/FieldConditionUtils"
import { getChildValueByChildParent } from "../../../Utils/FieldReferenceUtils"

function DropdownSelect({
  label,
  id,
  panel = [],
  listField,
  fieldItem,
  isReadOnly,
  isMandatory,
  parent,
  child,
  register,
  resetField,
  defaultValue,
  condition,
  getValues,
  setValue,
  unregister,
}) {
  const dispatch = useDispatch()
  const [cascadeData, setCascadeData] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  // redux
  const dropdownData = useSelector((state) => state.dropdown.data)
  const hiddenField = useSelector((state) => state.hiddenElement.hiddenField)
  const filter = useSelector((state) => state.list.filtering)

  useEffect(() => {
    if (dropdownData.length) {
      dropdownData.forEach((dropdownItem) => {
        if (dropdownItem.id === id) {
          if (dropdownItem.valueList.length) {
            setCascadeData(dropdownItem.valueList)
            setValue(id, dropdownItem.valueList[0].value)
          } else {
            setCascadeData([])
            setValue(id, "")
          }
        }
      })
      dispatch(setDropdown([]))
    }
  }, [dropdownData])

  useEffect(() => {
    if (defaultValue.length) {
      setCascadeData(defaultValue)
      setValue(id, defaultValue[0].value)
    }
  }, [defaultValue])

  useEffect(() => {
    for (let i = 0; i < filter.length; i++) {
      if (filter[i].id == id) {
        setValue(id, filter[i].value)
        break
      }
    }

    const dropdownEl = window.$("#" + id)
    // on dropdown show
    dropdownEl.on("show.bs.select", () => {
      // payload for request cascade
      const payload = { referenceName: id, param: [] }

      // check if dropdown has parent
      if (parent && parent.length) {
        parent.forEach((parentId) => {
          const parentValue = getValues(parentId)
          // push selected parent value to payload param
          payload.param.push({ id: parentId, value: parentValue })
        })
      }
      // if dropdown doesnt has parent (dropdown parent)
      else {
        // push empty id & value to payload
        payload.param.push({ id: "", value: "" })
      }

      // if location = top action (filter modal)
      if (fieldItem.isLocation) {
        Object.assign(payload, { isLocation: fieldItem.isLocation })
      }

      // get reference
      getReference(payload).then((res) => {
        // set dropdown option
        setCascadeData(res.data.data)
        setIsLoading(false)
      })
    })

    // if has parent
    if (parent.length > 0) {
      parent.forEach((parentId) => {
        const parentEl = document.getElementById(parentId)
        // if dropdown parent is changed
        // console.log(parentEl)
        if (parentEl)
          parentEl.addEventListener("change", () => {
            // console.log(`parent ${parentId} change`)
            // set empty current cascade data
            setCascadeData([])
            // reset current field value
            resetField(id)
            const currentDropdown = document.getElementById(id)
            // currentDropdown.value = '' // set selected value to default label
            currentDropdown.dispatchEvent(new Event("change"))
            // reset child field
            if (child.length) {
              child.forEach((childId) => {
                resetField(childId)
              })
            }
          })
      })
    }

    // if has child
    // get child value by child parent
    if (child.length > 0) {
      child.forEach((childId) => {
        dropdownEl.on("changed.bs.select", (e) => {
          setValue(id, e.target.value) // set current value
          getChildValueByChildParent(childId, panel, getValues, setValue)
        })
      })
    }

    // if has condition
    if (condition?.length > 0) {
      // on first load
      const currentValue = defaultValue.length ? defaultValue[0].value : ""
      handleConditionValue(currentValue, panel, condition, dispatch, setValue)
      // on dropdown changed
      dropdownEl.on("changed.bs.select", () => {
        const currentValue = window.$("#" + id).val()
        handleConditionValue(currentValue, panel, condition, dispatch, setValue)
      })
    }

    dropdownEl.on("changed.bs.select", (e) => {
      if (e.target.value) setValue(id, e.target.value)
    })
  }, [])

  // if cascadeDate is changed => refresh selectpicker
  useEffect(() => {
    window.$("#" + id).selectpicker("refresh")
  }, [cascadeData])

  return (
    <>
      <label onClick={() => console.log(fieldItem)}>
        {label}
        {isMandatory && (
          <span className="text-danger font-weight-bold"> *</span>
        )}
      </label>
      <select
        id={id}
        className="selectpicker w-100"
        data-live-search="true"
        data-style=""
        data-style-base="form-control"
        defaultValue={defaultValue?.length ? defaultValue[0].value : ""}
        {...register}
        disabled={isReadOnly}
      >
        <option value="" disabled>
          Pilih {label}
        </option>
        {cascadeData?.length > 0 &&
          cascadeData?.map((data, index) => (
            <option key={index} value={data.value}>
              {data.label}
            </option>
          ))}
        {isLoading && (
          <option value="" disabled>
            Memuat data...
          </option>
        )}
      </select>
      {/* <small>
        id: {id}. parent: {JSON.stringify(parent)}. child:{' '}
        {JSON.stringify(child)}
      </small> */}
    </>
  )
}

export default DropdownSelect
