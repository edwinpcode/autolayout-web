import React, { useEffect, useState } from "react"
import { useDispatch } from "react-redux"
import {
  removeHiddenField,
  setHiddenField,
} from "../../../Store/HiddenElement/hiddenElementSlice"
import { handleConditionValue } from "../../../Utils/FieldConditionUtils"

export default function InputRadio({
  id,
  data,
  register,
  condition,
  defaultValue = [],
  setValue,
  panel = [],
  isReadOnly,
  getValues,
  ErrorMessage,
  errors,
  unregister,
}) {
  const dispatch = useDispatch()

  useEffect(() => {
    //set value
    if (defaultValue.length && defaultValue[0].selected === "true") {
      setValue(id, defaultValue[0].dataId)
    } else if (defaultValue.length > 1 && defaultValue[1].selected === "true") {
      setValue(id, defaultValue[1].dataId)
    }

    const radioEl = window.$("." + id)

    // if has condition
    if (condition?.length > 0) {
      // set data
      // if (defaultValue[0].selected === 'true') {
      //   setValue(id, defaultValue[0].dataId)
      // } else if (defaultValue[1].selected === 'true') {
      //   setValue(id, defaultValue[1].dataId)
      // }

      // on first load
      if (defaultValue.length && defaultValue[0].selected === "true") {
        const currentValue = defaultValue.length ? defaultValue[0].dataId : ""
        handleConditionValue(currentValue, panel, condition, dispatch, setValue)
      } else if (
        defaultValue.length > 1 &&
        defaultValue[1].selected === "true"
      ) {
        const currentValue = defaultValue.length ? defaultValue[1].dataId : ""
        handleConditionValue(currentValue, panel, condition, dispatch, setValue)
      }

      // const currentValue = condition ? condition[0].value[0] : ''
      // handleConditionValue(currentValue)
      // console.log('ini baru load = ', currentValue)

      // on radio changed
      radioEl.on("click.bs.select", () => {
        const currentValue = window.$("." + id + ":checked").val()
        handleConditionValue(currentValue, panel, condition, dispatch, setValue)
      })
    }
  }, [])

  return (
    <div className={`form-group clearfix`}>
      <label>
        {data.label}
        {data.isMandatory === "1" && (
          <span className="text-danger font-weight-bold"> *</span>
        )}
      </label>
      <div className="row">
        {data.valueList.map((radio, index) => {
          return (
            <div
              key={index}
              className="col-lg-6 col-md-6 col-sm-6 col-xs-6 col-6"
            >
              <div className="icheck-danger d-inline" key={radio.dataId}>
                <input
                  {...register}
                  disabled={isReadOnly}
                  defaultChecked={radio.selected === "true"}
                  className={id}
                  type={data.type}
                  id={radio.dataId}
                  value={radio.dataId}
                />
                <label htmlFor={radio.dataId}>{radio.dataDesc}</label>
              </div>
            </div>
          )
        })}{" "}
      </div>
    </div>
  )
}
