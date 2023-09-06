import React, { useEffect, useState } from 'react'
import { getChart } from '../../Services/ChartService';
import Chart from './Chart'

const ChartList = ({item, key}) => {
    return (
        <div id={key}>
            {item ? item.map((chart, key) => 
                <Chart chart={chart.valueList[0]} key={key} fieldLabel={chart.fieldLabel}/>
            ): null}
        </div>
    )
}

export default ChartList