import { useEffect, useState } from 'react'
import {
  dateDisplay,
  dateValue,
  getAge,
  getMonthAge,
  getYearAge,
} from '../../../Utils/DatetimeUtils'
import moment from 'moment'
import 'moment/locale/id'
import FieldCascadingUtil from '../../../Utils/FieldCascadingUtil'
moment.locale(process.env.REACT_APP_DATE_LANG)

function InputDate({
  fieldItem,
  label,
  id,
  register,
  child,
  setValue,
  view,
  defaultValue,
  watch,
  isMandatory,
  hide,
  fieldList,
  getValues,
  resetField,
  ...props
}) {
  const [displayValue, setDisplayValue] = useState('')

  const clear = () => {
    resetField(id)
    setDisplayValue('')
  }

  const inputWatch = watch(id)
  useEffect(() => {
    if (inputWatch && inputWatch !== '') {
      setDisplayValue(
        dateDisplay(inputWatch, process.env.REACT_APP_DATE_FORMATVAL)
      )
      if (child.length !== 0) {
        // const year = getYearAge(inputWatch)
        // const month = getMonthAge(inputWatch)
        // setValue(child[0], year.toString())
        // if (child.length >= 2) {
        //   setValue(child[1], month.toString())
        // }
        for (let i = 0; i < child.length; i++) {
          FieldCascadingUtil(fieldList, child[i], getValues, setValue)
        }
      }
    }

    window.$(function () {
      const today = moment().format('DD/MM/YYYY')
      const handleMinDate = () => {
        if (fieldItem.rule === 'onlyPresentDate') return today
        else return false
      }
      const handleMaxDate = () => {
        if (fieldItem.rule === 'onlyPastDate') return today
        else return false
      }
      window.$(`#date_${id}`).daterangepicker({
        singleDatePicker: true,
        startDate:
          inputWatch === ''
            ? moment().format('DD/MM/YYYY')
            : moment(inputWatch).format('DD/MM/YYYY'),
        autoUpdateInput: false,
        showDropdowns: true,
        locale: {
          format: 'DD/MM/YYYY',
          applyLabel: 'Pilih',
          cancelLabel: 'Batal',
          daysOfWeek: ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'],
          monthNames: [
            'Januari',
            'Februari',
            'Maret',
            'April',
            'Mei',
            'Juni',
            'Juli',
            'Agustus',
            'September',
            'Oktober',
            'November',
            'Desember',
          ],
        },
        minDate: handleMinDate(),
        maxDate: handleMaxDate(),
        drops: fieldItem.type === 'date' ? 'up' : 'down',
      })
      // on apply
      window
        .$(`#date_${id}`)
        .on('apply.daterangepicker', function (ev, picker) {
          const newDisplayValue = picker.startDate.format(
            process.env.REACT_APP_DATE_FORMATDISP
          )
          const newInputValue = picker.startDate.format(
            process.env.REACT_APP_DATE_FORMATVAL
          )
          const formattedDisplayValue = moment(newDisplayValue).format(
            process.env.REACT_APP_DATE_FORMATDISP
          )
          setDisplayValue(formattedDisplayValue)
          window.$(`#date_${id}`).val(formattedDisplayValue)
          setValue(id, newInputValue)
          window.$('.daterangepicker').hide()
        })
    })
  }, [inputWatch])

  useEffect(() => {
    if (defaultValue && defaultValue !== '') {
      setValue(
        id,
        dateValue(defaultValue, process.env.REACT_APP_DATE_FORMATVAL)
      )
    }
  }, [])

  return (
    <>
      <label
        onClick={() => {
          console.log(fieldItem)
        }}
        className={`${hide ? 'hidden' : ''}`}
      >
        {label}
        {isMandatory && (
          <span className="text-danger font-weight-bold"> *</span>
        )}
      </label>

      <div className="input-group">
        <div className="input-group-prepend">
          <span className="input-group-text">
            <i className="far fa-calendar-alt"></i>
          </span>
        </div>
        <input
          type="text"
          className="form-control datetimepicker-input"
          id={`date_${id}`}
          autoComplete="off"
          {...props}
          defaultValue={displayValue}
          onChange={(e) => e.preventDefault()}
          onKeyDown={(e) => e.preventDefault()}
        />
      </div>
      <input
        type="hidden"
        {...props}
        {...register}
        id={id}
        data-field="date"
        onChange={(e) => e.preventDefault()}
        onKeyDown={(e) => e.preventDefault()}
      />
    </>
  )
}

export default InputDate
