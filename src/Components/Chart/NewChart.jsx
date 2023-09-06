import React, { useState } from 'react'
// highcharts
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import drilldown from 'highcharts/modules/drilldown.js'
import highcharts3d from 'highcharts/highcharts-3d'
import exporting from 'highcharts/modules/exporting'
import exportData from 'highcharts/modules/export-data'
// data
import listChart from '../../Data/Chart/listChart.json'
import dataSeries from '../../Data/Chart/series.json'
import dataDrilldown from '../../Data/Chart/drilldown.json'
//plugin
drilldown(Highcharts)
highcharts3d(Highcharts)
exporting(Highcharts)
exportData(Highcharts)

export default function NewChart() {
  const [dataChart, setDataChart] = useState()
  const [chooseChart, setChooseChart] = useState()
  const [title, setTitle] = useState()
  const [subtitle, setSubtitle] = useState()
  const [yTitle, setYTitle] = useState()
  const [threeD, setThreeD] = useState()
  const [percentage, setPercentage] = useState()

  const updateChart = (
    percentage,
    threeD,
    type,
    title,
    subtitle,
    yTitle,
    innerSize,
    startAngle,
    endAngle
  ) => {
    const baseChart = {
      credits: {
        enabled: false,
        href: '',
        text: '',
      },
      chart: {
        type: type,
        options3d: { enabled: threeD, alpha: 45, beta: 0 },
      },
      title: {
        align: 'left',
        text: title,
      },
      subtitle: {
        align: 'left',
        text: subtitle,
      },
      accessibility: {
        announceNewData: {
          enabled: true,
        },
      },
      xAxis: {
        type: 'category',
      },
      yAxis: {
        title: {
          text: yTitle,
        },
      },
      legend: {
        enabled: false,
      },
      plotOptions: {
        series: {
          dataLabels: {
            enabled: true,
            format: percentage,
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
        headerFormat: '<span style="font-size:11px">{point.name}</span><br>',
        pointFormat: percentage,
      },
      series: [dataSeries],
      drilldown: dataDrilldown,
    }
    setDataChart(baseChart)
  }

  const handleApply = (e) => {
    e.preventDefault()

    if (chooseChart === 'Pie') {
      updateChart(
        percentage
          ? '{point.name}: <b>{point.y}</b> ({point.percentage:.1f}%)<br/>'
          : '{point.name}: <b>{point.y}</b> <br/>',
        threeD,
        'pie',
        title ? title : 'Title',
        subtitle,
        yTitle,
        0
      )
    }
    if (chooseChart === 'Donut') {
      updateChart(
        percentage
          ? '{point.name}: <b>{point.y}</b> ({point.percentage:.1f}%)<br/>'
          : '{point.name}: <b>{point.y}</b> <br/>',
        threeD,
        'pie',
        title ? title : 'Title',
        subtitle,
        yTitle,
        100
      )
    }
    if (chooseChart === 'Semi Circle') {
      updateChart(
        percentage
          ? '{point.name}: <b>{point.y}</b> ({point.percentage:.1f}%)<br/>'
          : '{point.name}: <b>{point.y}</b> <br/>',
        threeD,
        'pie',
        title ? title : 'Title',
        subtitle,
        yTitle,
        100,
        -90,
        90
      )
    }
    if (chooseChart === 'Column') {
      updateChart(
        percentage
          ? '{point.name}: <b>{point.y}</b> ({point.percentage:.1f}%)<br/>'
          : '{point.name}: <b>{point.y}</b> <br/>',
        threeD,
        'column',
        title ? title : 'Title',
        subtitle,
        yTitle,
        0
      )
    }
    if (chooseChart === 'Bar') {
      updateChart(
        percentage
          ? '{point.name}: <b>{point.y}</b> ({point.percentage:.1f}%)<br/>'
          : '{point.name}: <b>{point.y}</b> <br/>',
        threeD,
        'bar',
        title ? title : 'Title',
        subtitle,
        yTitle,
        0
      )
    }
    if (chooseChart === 'Area') {
      updateChart(
        percentage
          ? '{point.name}: <b>{point.y}</b> ({point.percentage:.1f}%)<br/>'
          : '{point.name}: <b>{point.y}</b> <br/>',
        threeD,
        'area',
        title ? title : 'Title',
        subtitle,
        yTitle,
        0
      )
    }
    if (chooseChart === 'Line') {
      updateChart(
        percentage
          ? '{point.name}: <b>{point.y}</b> ({point.percentage:.1f}%)<br/>'
          : '{point.name}: <b>{point.y}</b> <br/>',
        threeD,
        'line',
        title ? title : 'Title',
        subtitle,
        yTitle,
        0
      )
    }
  }

  return (
    <div className="row">
      <div className="col-9">
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Chart</h3>

            <div className="card-tools p-0 m-0">
              <button
                type="button"
                className="btn btn-tool p-0 m-0"
                data-card-widget="maximize"
              >
                <i className="fas fa-expand"></i>
              </button>
            </div>
          </div>
          <div className="card-body py-4">
            {dataChart ? (
              <HighchartsReact highcharts={Highcharts} options={dataChart} />
            ) : (
              <p>Loading...</p>
            )}
          </div>
        </div>
      </div>
      <div className="col-3">
        {chooseChart ? (
          <div className="col-12 card">
            <div className="card-header">
              <h3 className="card-title">Choose Chart</h3>
            </div>
            <div className=" d-flex flex-column justify-content-center ">
              <div className="mx-auto mt-3 ">
                <h4 className="text-center">{chooseChart}</h4>
                <button
                  className="btn btn-danger mx-auto"
                  onClick={() => {
                    setChooseChart(null)
                    setThreeD(false)
                    setPercentage(false)
                  }}
                >
                  Change Chart
                </button>
              </div>
              <div className=" needs-validation">
                <div className="form-group">
                  <label htmlFor="title">Title</label>
                  <input
                    className="form-control form-control-sm"
                    id="title"
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="subtitle">Subtitle</label>
                  <input
                    className="form-control form-control-sm"
                    id="subtitle"
                    onChange={(e) => setSubtitle(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="yTitle">Y Title</label>
                  <input
                    className="form-control form-control-sm"
                    id="yTitle"
                    onChange={(e) => setYTitle(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <div className="custom-control custom-switch">
                    <input
                      type="checkbox"
                      className="custom-control-input"
                      id="customSwitch1"
                      onChange={(e) => setThreeD(e.target.checked)}
                    />
                    <label
                      className="custom-control-label"
                      htmlFor="customSwitch1"
                    >
                      Switch for 3D Chart
                    </label>
                  </div>
                </div>{' '}
                <div className="form-group">
                  <div className="custom-control custom-switch">
                    <input
                      type="checkbox"
                      className="custom-control-input"
                      id="customSwitch2"
                      onChange={(e) => setPercentage(e.target.checked)}
                    />
                    <label
                      className="custom-control-label"
                      htmlFor="customSwitch2"
                    >
                      Show Percentage
                    </label>
                  </div>
                </div>
                <button
                  className="btn btn-danger mb-2"
                  onClick={(e) => handleApply(e)}
                >
                  Apply
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="row">
            {listChart.data.map((item) => {
              return (
                <div className="col-6" key={item.name}>
                  <div className="small-box bg-danger">
                    <div className="inner">
                      <h6>{item.name}</h6>
                    </div>
                    <div className="icon">
                      <i className="ion ion-pie-graph"></i>
                    </div>
                    <button
                      type="button"
                      className="btn small-box-footer w-100"
                      onClick={() => setChooseChart(item.name)}
                    >
                      Create
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
