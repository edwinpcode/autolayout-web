import React, { useState, useEffect } from 'react'
import { datetimeDisplay, datetimeValue } from '../../../Utils/DatetimeUtils'

const InputDatetime = ({
  label,
  id,
  register,
  child,
  setValue,
  view,
  defaultValue,
  watch,
  hide,
  isMandatory,
  ...props
}) => {
  const [displayValue, setDisplayValue] = useState('')

  window.$(function () {
    window.$(`#datetime_${id}`).daterangepicker({
      autoUpdateInput: false,
      showDropdowns: true,
      singleDatePicker: true,
      timePickerIncrement: 1,
      timePicker: true,
      locale: {
        format: process.env.REACT_APP_DATETIME_FORMATDISP,
      },
      minYear: 1900,
    })
    window
      .$(`#datetime_${id}`)
      .on('apply.daterangepicker', function (ev, picker) {
        const newDisplayValue = datetimeDisplay(
          picker.startDate,
          process.env.REACT_APP_DATETIME_FORMATDISP
        )
        const newInputValue = datetimeValue(
          picker.startDate,
          process.env.REACT_APP_DATETIME_FORMATDISP
        )
        setDisplayValue(newDisplayValue)
        setValue(id, newInputValue)
        window.$('.daterangepicker').hide()
      })
  })

  const inputWatch = watch(id)
  useEffect(() => {
    if (inputWatch && inputWatch !== '') {
      setDisplayValue(
        datetimeDisplay(inputWatch, process.env.REACT_APP_DATETIME_FORMATVAL)
      )
    }
  }, [setDisplayValue, inputWatch])

  useEffect(() => {
    if (displayValue && displayValue !== '') {
      setValue(
        id,
        datetimeValue(displayValue, process.env.REACT_APP_DATETIME_FORMATDISP)
      )
    }
  }, [displayValue])

  useEffect(() => {
    if (defaultValue && defaultValue !== '') {
      setValue(
        id,
        datetimeValue(defaultValue, process.env.REACT_APP_DATETIME_FORMATVAL)
      )
    }
  }, [])

  return (
    <>
      <label className={`${hide ? 'hidden' : ''}`}>
        {label}
        {isMandatory && (
          <span className="text-danger font-weight-bold"> *</span>
        )}
      </label>
      <div className="input-group date" data-target-input="nearest">
        <div
          className="input-group-prepend"
          data-target={`#datetime_${id}`}
          data-toggle="datetimepicker"
        >
          <div className="input-group-text">
            <i className="fa fa-calendar"></i>
          </div>
        </div>
        <input
          type="text"
          className="form-control datetimepicker-input"
          id={`datetime_${id}`}
          autoComplete="off"
          value={displayValue}
          onChange={(e) => e.preventDefault()}
          onKeyDown={(e) => e.preventDefault()}
        />
        <input
          {...props}
          type="hidden"
          {...register}
          id={id}
          onChange={(e) => e.preventDefault()}
          onKeyDown={(e) => e.preventDefault()}
        />
      </div>
    </>
  )
}

export default InputDatetime
