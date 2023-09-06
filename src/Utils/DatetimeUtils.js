import moment from 'moment'
import 'moment/locale/id'
moment.locale(process.env.REACT_APP_DATE_LANG)

// change to date value format
export const dateValue = (value, format) => {
  const result = moment(value, format).format(
    process.env.REACT_APP_DATE_FORMATVAL
  )
  return result
}

// change to date format
export const dateDisplay = (value, format) => {
  const result = moment(value, format).format(
    process.env.REACT_APP_DATE_FORMATDISP
  )
  return result
}

export const dateNowDisplay = () => {
  const result = moment().format(process.env.REACT_APP_DATETIME_FORMATDISP)
  return result
}

export const dateNowValue = () => {
  const result = moment().format(process.env.REACT_APP_DATE_FORMATVAL)
  return result
}

export const timeValue = (value, format) => {
  const result = moment(value, format).format(
    process.env.REACT_APP_TIME_FORMATVAL
  )
  return result
}

export const timeDisplay = (value, format) => {
  const result = moment(value, format).format(
    process.env.REACT_APP_TIME_FORMATDISP
  )
  return result
}

export const timeNowDisplay = (value) => {
  const result = moment().format(process.env.REACT_APP_TIME_FORMATDISP)
  return result
}

export const timeNowValue = (value) => {
  const result = moment().format(process.env.REACT_APP_TIME_FORMATDISP)
  return result
}

// change to datetime value format
export const datetimeValue = (value, format) => {
  const result = moment(value, format).format(
    process.env.REACT_APP_DATETIME_FORMATVAL
  )
  return result
}

// change to datetime display format
export const datetimeDisplay = (value, format) => {
  const result = moment(value, format).format(
    process.env.REACT_APP_DATETIME_FORMATDISP
  )
  return result
}

export const datetimeNowDisplay = () => {
  const result = moment().format(process.env.REACT_APP_DATETIME_FORMATDISP)
  return result
}

export const datetimeNowValue = () => {
  const result = moment().format(process.env.REACT_APP_DATETIME_FORMATDISP)
  return result
}

export const getYearAge = (date) => {
  return moment().diff(date, 'years')
}

export const getMonthAge = (date) => {
  const currentDate = moment()
  currentDate.subtract(getYearAge(date), 'years')
  const diffMonths = currentDate.diff(date, 'months')
  return diffMonths
}
