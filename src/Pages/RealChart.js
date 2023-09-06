import React, { useEffect, useState } from 'react'
// highcharts
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import drilldown from 'highcharts/modules/drilldown.js'
import highcharts3d from 'highcharts/highcharts-3d'
import exporting from 'highcharts/modules/exporting'
import exportData from 'highcharts/modules/export-data'
import accessibility from 'highcharts/modules/accessibility'
// import dataDrilldown from '../../Data/Chart/drilldown.json'
import { getDrilldown } from '../Services/ChartService'

//plugin
drilldown(Highcharts)
highcharts3d(Highcharts)
exporting(Highcharts)
exportData(Highcharts)
accessibility(Highcharts)

export default function Chart({ chart }) {
  const [dataChart, setDataChart] = useState({})
  const [dataSeries, setDataSeries] = useState({})
  const [internalChart, setInternalChart] = useState()

  const updateChart = ({ type, format, innerSize, startAngle, endAngle }) => {
    const baseChart = {
      credits: {
        enabled: false,
        href: '',
        text: '',
      },
      chart: {
        type: type,
      },
      title: {
        text: chart.title,
        align: 'left',
      },
      plotOptions: {
        series: {
          stacking: chart.stacking === 'True' ? 'normal' : undefined,
          dataLabels: {
            enabled: true,
            format: format,
          },
        },
        pie: {
          innerSize: innerSize,
          startAngle: startAngle,
          endAngle: endAngle,
          depth: 70,
        },
      },
      yAxis: {
        title: {
          text: chart.yTitle,
        },
      },
      series: dataSeries,
    }
    setDataChart(baseChart)
  }

  const callback = (chart) => {
    setInternalChart(chart)
  }

  useEffect(() => {
    let format = ''
    if (
      chart.type === 'line' ||
      chart.type === 'column' ||
      chart.type === 'area' ||
      chart.type === 'bar'
    ) {
      if (chart.stacking === 'True') {
        if (chart.percentage === 'True') {
          format = '<b>{point.y}</b> ({point.percentage:.1f}%)<br/>'
        } else {
          format = '<b>{point.y}</b> <br/>'
        }
      } else format = '<b>{point.y}</b> <br/>'
    } else if (chart.percentage === 'True') {
      format = '{point.name}: <b>{point.y}</b> ({point.percentage:.1f}%)<br/>'
    } else {
      format = '{point.name}: <b>{point.y}</b> <br/>'
    }

    if (chart.type === 'pie') {
      updateChart({ type: 'pie', format })
    } else if (chart.type === 'donut') {
      updateChart({ type: 'pie', format, innerSize: 100 })
    } else if (chart.type === 'semiCircle') {
      updateChart({
        type: 'pie',
        format,
        innerSize: 100,
        startAngle: -90,
        endAngle: 90,
      })
    } else if (chart.type === 'column') {
      updateChart({ type: 'column', format })
    } else if (chart.type === 'bar') {
      updateChart({ type: 'bar', format })
    } else if (chart.type === 'area') {
      updateChart({ type: 'area', format })
    } else if (chart.type === 'line') {
      updateChart({ type: 'line', format })
    }
  }, [dataSeries])

  useEffect(() => {
    const series = []
    chart.series.map((data) => {
      const values = []
      data.data.map((item) => {
        item = {
          name: item.name,
          y: parseFloat(item.y),
          color: item.color,
        }
        values.push(item)
      })
      const serie = {
        name: data.name,
        colorByPoint: data.colorByPoint === 'True' ? true : false,
        color: data.color,
        data: values,
      }
      series.push(serie)
    })
    setDataSeries(series)
  }, [chart])

  return (
    <div className="card">
      <div className="card-body py-4">
        <HighchartsReact
          highcharts={Highcharts}
          options={dataChart}
          callback={callback}
        />
      </div>
    </div>
  )
}
