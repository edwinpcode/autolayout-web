import React from 'react'
import Chart from '../Chart/Chart'

const Panel = ({ item, id }) => {
  return (
    <div id={id} className="row align-items-start">
        {item.listField.map((data) => 
            <div className={`col-md-${data.width}`} key={data.fieldId} id={data.fieldId}> 
                {data.fieldType === 'chart' && (
                    <Chart chart={data.valueList[0]} fieldLabel={data.fieldLabel}/>
                )}
            </div>
        )}
    </div>
  )
}

export default Panel