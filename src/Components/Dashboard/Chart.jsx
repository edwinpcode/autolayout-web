import React, { useEffect, useState } from "react"
import Highcharts from "highcharts"
import HighchartsReact from "highcharts-react-official"
import drilldown from "highcharts/modules/drilldown.js"
import highcharts3d from "highcharts/highcharts-3d"
import exporting from "highcharts/modules/exporting"
import exportData from "highcharts/modules/export-data"
import accessibility from "highcharts/modules/accessibility"

drilldown(Highcharts)
highcharts3d(Highcharts)
exporting(Highcharts)
exportData(Highcharts)
accessibility(Highcharts)

const Chart = () => {
  const [arrayOptions1, setArrayOptions1] = useState([])
  const [arrayOptions2, setArrayOptions2] = useState([])
  const [arrayOptions3, setArrayOptions3] = useState([])

  const setData = ({ title, xTitle, yTitle, index }) => {
    let res = 200
    let arrayData = []
    for (let i = 0; i < 10; i++) {
      const rand = Math.floor(Math.random() * (res >= 50 ? res / 2 : res)) || 1
      arrayData = [
        ...arrayData,
        {
          name: `Data ${i + 1}`,
          y: rand,
        },
      ]
      res -= rand
      if (!res) {
        break
      }
    }
    let total = arrayData.reduce((sum, point) => sum + point.y, 0)
    const opt = {
      subtitle: {
        text: `Total : ${total}`,
      },
      exporting: {
        enabled: false,
      },
      credits: {
        enabled: false,
      },
      title: {
        text: `Chart ${index}`,
      },
      series: [
        {
          colorByPoint: true,
          name: "Count",
          data: arrayData,
        },
      ],
      xAxis: {},
      yAxis: {
        title: {
          text: "Name",
        },
      },
      loading: {
        labelStyle: {
          color: "white",
        },
        style: {
          backgroundColor: "gray",
        },
      },
      chart: {
        type: "pie",
      },
      plotOptions: {
        pie: {
          innerSize: 200,
          allowPointSelect: true,
          cursor: "pointer",
          borderWidth: 2,
          dataLabels: {
            enabled: true,
            distance: -40,
            format: "{point.name}: <b>{point.percentage:.1f}%</b>",
            filter: {
              operator: ">",
              property: "percentage",
              value: 10,
            },
          },
        },
      },
      tooltip: {
        pointFormat: "{series.name}: {point.y}",
      },
    }
    return opt
  }

  useEffect(() => {
    for (let i = 0; i < 3; i++) {
      const opt = setData({
        index: i + 1,
      })
      setArrayOptions1((array) => [...array, opt])
    }
    for (let i = 0; i < 3; i++) {
      const opt = setData({
        index: i + 1,
      })
      setArrayOptions2((array) => [...array, opt])
    }
    for (let i = 0; i < 3; i++) {
      const opt = setData({
        index: i + 1,
      })
      setArrayOptions3((array) => [...array, opt])
    }
  }, [])

  return (
    <div>
      <div className="card card-success">
        <div className="card-header">
          <span className="">KPI Koperasi</span>
          <div className="card-tools">
            <button className="btn btn-tool" data-card-widget="collapse">
              <i className="fas fa-minus" id="collapseButton"></i>
            </button>
          </div>
        </div>
        <div className="card-body">
          <div className="d-flex row">
            {arrayOptions1.map((data, index) => (
              <div className="col-4 border" key={index}>
                <HighchartsReact highcharts={Highcharts} options={data} />
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="card card-success">
        <div className="card-header">
          <span className="">KPI Unit Kerja</span>
          <div className="card-tools">
            <button className="btn btn-tool" data-card-widget="collapse">
              <i className="fas fa-minus" id="collapseButton"></i>
            </button>
          </div>
        </div>
        <div className="card-body">
          <div className="d-flex row">
            {arrayOptions2.map((data, index) => (
              <div className="col-4 border" key={index}>
                <HighchartsReact highcharts={Highcharts} options={data} />
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="card card-success">
        <div className="card-header">
          <span className="">KPI Individu</span>
          <div className="card-tools">
            <button className="btn btn-tool" data-card-widget="collapse">
              <i className="fas fa-minus" id="collapseButton"></i>
            </button>
          </div>
        </div>
        <div className="card-body">
          <div className="d-flex row">
            {arrayOptions3.map((data, index) => (
              <div className="col-4 border" key={index}>
                <HighchartsReact highcharts={Highcharts} options={data} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Chart
