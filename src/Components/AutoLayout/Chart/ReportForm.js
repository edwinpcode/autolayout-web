import React, { useEffect, useState } from 'react'
import { getAllReportForm } from '../../../Services/ReportService'
import { useQuery } from 'react-query'
import ChartForm from './ChartForm'

const Report = ({ fieldId, level, path }) => {
  const [field, setField] = useState()

  useEffect(() => {
    getAllReportForm(fieldId, level, path).then((response) => {
      if (response.data.status === '1') {
        setField(response.data.listField)
      }
    })
  }, [])

  return (
    <div className="row align-items-start">
      {field?.map((item) => (
        <div className={`col-12`} key={item.fieldId} id={item.fieldId}>
          {item.fieldId === fieldId && (
            <ChartForm chart={item.valueList[0]} fieldLabel={item.fieldLabel} />
          )}
        </div>
      ))}
    </div>
  )
}

export default Report
