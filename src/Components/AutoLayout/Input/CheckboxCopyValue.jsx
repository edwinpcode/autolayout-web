import React, { useEffect, useState } from 'react'
import { useWatch } from 'react-hook-form'
import { useDispatch } from 'react-redux'
import { axiosPost } from '../../../Services/AutoLayoutService'
import { resetDropdown, setDropdown } from '../../../Store/Input/DropdownSlice'
import { setLoadingSpin } from '../../../Store/Loading/LoadingSlice'
import { handleParamValues } from '../../../Utils/ParamUtils'

const CheckboxCopyValue = ({
  child,
  control,
  flag,
  getValues,
  hide,
  id,
  isMandatory,
  label,
  parent,
  path,
  resetField,
  setValue,
  watch,
  width,
  ...props
}) => {
  const dispatch = useDispatch()
  const [checked, setChecked] = useState(false)

  const handleChecked = async () => {
    dispatch(setLoadingSpin(true))
    // setup payload
    const payload = {
      reference: id,
      param: handleParamValues(parent, getValues, undefined),
    }
    // get data checkbox
    await axiosPost(path, payload).then((res) => {
      let dropdownData = []
      res.data.data.forEach((data) => {
        const el = document.getElementById(data.fieldId)
        if (data.value || data.value === '') {
          setValue(data.fieldId, data.value)
          el.readOnly = true
        }
        if (data.valueList && data.valueList.length) {
          dropdownData.push({ id: data.fieldId, valueList: data.valueList })
          setValue(data.fieldId, data.valueList[0].value)
          el.nextElementSibling.disabled = true
          // set value dropdown
        }
      })
      console.log(dropdownData)
      dispatch(setDropdown(dropdownData))
    })
    dispatch(setLoadingSpin(false))
  }

  const handleChange = (isChecked) => {
    setChecked(isChecked)
    if (isChecked) {
      handleChecked()
    } else {
      let dropdownData = []
      child?.forEach((childId) => {
        const el = document.getElementById(childId)
        if (el.tagName === 'SELECT') {
          dropdownData.push({ id: childId, valueList: [] })
          el.nextElementSibling.disabled = false
        } else {
          setValue(childId, '')
          el.readOnly = false
        }
      })
      dispatch(setDropdown(dropdownData))
    }
  }

  useEffect(() => {
    parent.forEach((parentId) => {
      document.getElementById(parentId).addEventListener('change', () => {
        handleChange(false)
      })
    })
  }, [])

  return (
    <div className="form-group">
      <div className="custom-control custom-checkbox">
        <input
          className="custom-control-input"
          type="checkbox"
          id={id}
          value="1"
          checked={checked}
          onChange={(e) => handleChange(e.target.checked)}
        />
        <label htmlFor={id} className="custom-control-label">
          {label}
        </label>
      </div>
    </div>
  )
}

export default CheckboxCopyValue
