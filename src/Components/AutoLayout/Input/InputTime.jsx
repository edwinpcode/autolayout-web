import React, { useState, useEffect } from 'react'
import { timeDisplay, timeValue } from '../../../Utils/DatetimeUtils'
const InputTime = ({
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
    window.$(`#timepicker`).daterangepicker({
      autoUpdateInput: false,
      showDropdowns: true,
      singleDatePicker: true,
      timePicker: true,
      timePickerIncrement: 1,
      // timePicker24Hour: true,
      // timePickerSeconds: true,
      locale: {
        format: process.env.REACT_APP_TIME_FORMATDISP,
      },
    })
    window.$(`#timepicker`).on('show.daterangepicker', function (ev, picker) {
      picker.container.find('.calendar-table').hide()
    })

    // on apply
    window.$(`#timepicker`).on('apply.daterangepicker', function (ev, picker) {
      // console.log(picker)
      const newDisplayValue = timeDisplay(
        picker.startDate,
        process.env.REACT_APP_TIME_FORMATDISP
      )
      const newInputValue = timeValue(
        picker.startDate,
        process.env.REACT_APP_TIME_FORMATDISP
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
        timeDisplay(inputWatch, process.env.REACT_APP_TIME_FORMATVAL)
      )
    }
  }, [setDisplayValue, inputWatch])

  useEffect(() => {
    if (displayValue && displayValue !== '') {
      setValue(
        id,
        timeValue(displayValue, process.env.REACT_APP_TIME_FORMATDISP)
      )
    }
  }, [displayValue])

  useEffect(() => {
    if (defaultValue && defaultValue !== '') {
      setValue(
        id,
        timeValue(defaultValue, process.env.REACT_APP_TIME_FORMATVAL)
      )
    }
  }, [])

  return (
    <div className="bootstrap-timepicker">
      <div className="form-group">
        <label className={`${hide ? 'hidden' : ''}`}>
          {label}
          {isMandatory && (
            <span className="text-danger font-weight-bold"> *</span>
          )}
        </label>
        <div className="input-group date" data-target-input="nearest">
          <div
            className="input-group-prepend"
            data-target="#timepicker"
            data-toggle="datetimepicker"
          >
            <div className="input-group-text">
              <i className="far fa-clock"></i>
            </div>
          </div>
          <input
            type="text"
            className="form-control datetimepicker-input"
            id="timepicker"
            // id={`time_${id}`}
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
      </div>
    </div>
  )
}

export default InputTime
