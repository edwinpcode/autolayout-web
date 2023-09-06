import React, { useEffect, useState } from 'react'
// highcharts
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import drilldown from 'highcharts/modules/drilldown.js'
import highcharts3d from 'highcharts/highcharts-3d'
import exporting from 'highcharts/modules/exporting'
import exportData from 'highcharts/modules/export-data'
import accessibility from 'highcharts/modules/accessibility'
import dataDrilldown from '../../Data/Chart/drilldown.json'
import { getDrilldown } from '../../Services/ChartService'

const env = 'PRODUCTION'

//plugin
drilldown(Highcharts)
highcharts3d(Highcharts)
exporting(Highcharts)
exportData(Highcharts)
accessibility(Highcharts)

export default function Chart({ chart, fieldLabel }) {
  const [dataChart, setDataChart] = useState({})
  const [dataSeries, setDataSeries] = useState([])
  const [internalChart, setInternalChart] = useState()
  const [open, setOpen] = useState(true)

  const updateChart = ({ type, format, innerSize, startAngle, endAngle }) => {
    const baseChart = {
      credits: {
        enabled: false,
        href: '',
        text: '',
      },
      loading: {
        labelStyle: {
          color: 'white',
        },
        style: {
          backgroundColor: 'gray',
        },
      },
      chart: {
        events: {
          load: function () {
            this.showLoading('LOADING...')
            setTimeout(this.hideLoading(), 5000)
          },
          drilldown: function (e) {
            onDrilldown(e, this)
          },
          drillup: function (e) {
            onDrillup(e)
          },
        },
        type: type,
        options3d: {
          enabled: chart.threeD === 'True' ? true : false,
          alpha: 45,
          beta: 0,
        },
      },
      title: {
        align: 'left',
        text: chart.title,
      },
      subtitle: {
        align: 'center',
        text: chart.subtitle,
      },
      accessibility: {
        announceNewData: {
          enabled: true,
        },
      },
      xAxis: {
        type: 'category',
        labels: {
          format: '<b>{text}</b>',
        },
      },
      yAxis: {
        title: {
          text: chart.yTitle,
        },
      },
      legend: {
        enabled: true,
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
      tooltip: {
        shape: 'callout',
        // shared: true,
        headerFormat: '<div>{series.name}</div><br>',
        pointFormat: chart.percentage
          ? '{point.name}: <b>{point.y}</b> ({point.percentage:.1f}%)<br/>'
          : '{point.name}: <b>{point.y}</b> <br/>',
      },
      series: dataSeries,
      drilldown: {
        breadcrumbs: {
          // format: '<button>Back</button>',
          position: {
            align: 'right',
          },
        },
      },
    }
    setDataChart(baseChart)
  }

  let seriesId,
    param = []
  const onDrilldown = (e, chart) => {
    if (!e.seriesOptions) {
      chart.showLoading('LOADING...')
      const data = {
        name: e.point.name,
        id: e.point.drilldown,
      }
      param.push(data)
      if (e.point.series.options.seriesId) {
        seriesId = e.point.series.options.seriesId
      }
      let level = e.point.series.options._levelNumber
        ? e.point.series.options._levelNumber + 1
        : 1
      const payload = {
        referenceName: seriesId,
        param: param,
        sequence: `${level}`,
      }
      getDrilldown(payload)
        .then((res) => {
          const data = res.data
          let series, found
          if (env === 'LOCAL') {
            for (let i = 0; i < data.length; i++) {
              if (param.drilldown === data[i].id) {
                series = data[i]
              }
            }
            if (series) {
              // for(let i = 0; 0 < chart.drilldown.length; i++){
              //   if(series.id === chart.drilldown[i].id){
              //     found = true;
              //   }
              // }
              for (let i = 0; i < series.data.length; i++) {
                series.data[i].y = parseFloat(series.data[i].y)
              }
              if (!found) {
                chart.addSeriesAsDrilldown(e.point, series)
              }
            }
          } else {
            if (res.status !== '0') {
              series = res.data.data[0]
              if (series) {
                for (let i = 0; i < series.data.length; i++) {
                  series.data[i].y = parseFloat(series.data[i].y)
                }
                if (!found) chart.addSeriesAsDrilldown(e.point, series)
              }
              series.name = `${series.nama}`
              if (!found) chart.addSeriesAsDrilldown(e.point, series)
            } else {
              window.Swal.fire('Peringatan', 'Data tidak ditemukan', 'warning')
            }
          }
          chart.hideLoading()
        })
        .catch((e) => {
          chart.hideLoading()
        })
    }
  }

  const onDrillup = (e) => {
    param.pop()
  }

  useEffect(() => {
    const series = []
    chart.series.map((data) => {
      const values = []
      data.data.map((item) => {
        item = {
          name: item.name,
          y: parseFloat(item.y),
          drilldown: item.drilldown,
          color: item.color,
        }
        values.push(item)
      })
      const serie = {
        name: data.name,
        colorByPoint: data.colorByPoint === 'True' ? true : false,
        seriesId: data.seriesId,
        color: data.color,
        data: values,
      }
      series.push(serie)
    })
    setDataSeries(series)
  }, [])

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

  return (
    <div className="card card-danger">
      <div className="card-header">
        <h3 className="card-title">{fieldLabel}</h3>
        <div className="card-tools p-0 m-0">
          <button
            type="button"
            className="btn btn-tools p-0 m-0 text-white"
            data-card-widget="collapse"
          >
            <i className={open ? 'fas fa-minus' : 'fas fa-plus'}></i>
          </button>
        </div>
      </div>
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
