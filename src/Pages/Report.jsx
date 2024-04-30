import React, { useEffect, useState } from "react"
import Highcharts from "highcharts"
import HighchartsReact from "highcharts-react-official"
import Tab from "../Components/AutoLayout/Tab"
import TableList from "./TableList"
import { axiosPost } from "../Services/AutoLayoutService"
import { useSelector } from "react-redux"
import ReactSpeedometer from "react-d3-speedometer"
import VoiceAssistant from "Components/Voice/VoiceAssistant"

const tab = [
  { id: "chart", label: "Chart" },
  { id: "table", label: "Table" },
]

require("highcharts/modules/accessibility")(Highcharts)

function Report() {
  const [options, setOptions] = useState([])
  const [data, setData] = useState([])
  const [type, setType] = useState("")
  const [activeTabId, setActiveTabId] = useState("chart")
  const [loading, setLoading] = useState(false)
  // redux
  const user = useSelector((state) => state.user)
  const menu = useSelector((state) => state.menu)

  const sample = {
    value: 50,
    maxValue: 100,
    label: "KPI",
    description: "",
    customSegmentStops: [0, 33, 66, 100],
    segment: [
      {
        text: "Low",
        position: "INSIDE",
        color: "#555",
      },
      {
        text: "Medium",
        position: "INSIDE",
        color: "#555",
      },
      {
        text: "High",
        position: "INSIDE",
        color: "#555",
      },
    ],
  }

  const sample2 = {
    subtitle: {
      text: "",
    },
    exporting: {
      enabled: false,
    },
    credits: {
      enabled: false,
    },
    title: {
      text: "Jumlah Penduduk",
    },
    series: [
      {
        name: "Tahun 2000",
        data: [120, 148, 163, 110], // value setiap kota (yAxis)
      },
      {
        name: "Tahun 2005",
        data: [135, 160, 172, 121], // value setiap kota (yAxis)
      },
      {
        name: "Tahun 2010",
        data: [140, 173, 180, 133], // value setiap kota (yAxis)
      },
    ],
    xAxis: {
      categories: ["Yogyakarta", "Jakarta", "Bandung", "Semarang"], // posisi kiri
    },
    yAxis: {
      title: {
        text: "Banyak (Ribuan)", // posisi bawah
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
      type: "bar", // ini tipe nya
    },
    plotOptions: {
      bar: {
        // bar style
        dataLabels: {
          enabled: true,
        },
        groupPadding: 0.1,
      },
    },
    tooltip: {
      // hover di bar
      pointFormat: "{series.name}: {point.y}",
      valueSuffix: " Ribu",
    },
    legend: {
      // Kotak informasi di kanan
      layout: "vertical",
      align: "right",
      verticalAlign: "top",
      x: -40,
      y: 80,
      floating: true,
      borderWidth: 1,
      backgroundColor:
        Highcharts.defaultOptions.legend.backgroundColor || "#FFFFFF",
      shadow: true,
    },
  }

  const getChartOption = async (menu) => {
    const payload = {
      userId: user.id,
      menuId: menu.activeMenuId,
      moduleId: user.activeModule.id,
      roleId: user.activeRole.id,
    }
    setLoading(true)
    axiosPost("/reportchart", payload)
      .then((res) => {
        if (res.data.status == "1") {
          setData(res.data.data)
          setType(res.data.type)
        } else {
          window.Swal.fire("Kesalahan", res.data.message, "error")
        }
      })
      .catch((e) => {
        window.Swal.fire("Kesalahan", e.message, "error")
      })
      .finally(() => {
        setLoading(false)
      })
  }

  useEffect(() => {
    if (data.length && type == "speedometer") {
      const newData = data
      for (let i = 0; i < newData.length; i++) {
        let customSegmentStops = [0]
        for (let j = 0; j < newData[i].segment.length; j++) {
          let value =
            (newData[i].maxValue / newData[i].segment.length) * (j + 1)
          if (j + 1 == newData[i].segment.length) {
            value = newData[i].maxValue
          }
          customSegmentStops = [...customSegmentStops, value]
        }
        newData[i].customSegmentStops = customSegmentStops
      }
      setOptions(newData)
    }
  }, [data, type])

  useEffect(() => {
    getChartOption(menu)
  }, [menu])

  return (
    <div>
      <div>
        <span className="text-lg text-bold">{menu.activeMenuDesc}</span>
      </div>
      <div className="mb-3 mt-3">
        <Tab
          data={tab}
          activeTabId={activeTabId}
          setActiveTabId={setActiveTabId}
        />
      </div>
      <div className="row">
        <div className="col">
          {activeTabId === "chart" ? (
            <div>
              {loading ? (
                <div>Loading...</div>
              ) : (
                <div className="row">
                  {type == "speedometer" &&
                    options.map((item, index) => (
                      <div className="col-xl-4 col-md-6 border" key={index}>
                        <div>
                          <div>{item.title}</div>
                        </div>
                        <ReactSpeedometer
                          maxValue={item.maxValue}
                          value={item.value}
                          currentValueText={item.label}
                          needleHeightRatio={0.5}
                          segments={item.segment.length}
                          needleTransitionDuration={4000}
                          needleTransition="easeElastic"
                          customSegmentStops={item.customSegmentStops}
                          customSegmentLabels={item.segment}
                          height={250}
                          width={400}
                        />
                        <div>
                          <div>{item.description}</div>
                        </div>
                      </div>
                    ))}
                  {type == "chart" &&
                    data.map((item, index) => (
                      <div className="col-xl-4 col-md-6 border" key={index}>
                        <HighchartsReact
                          highcharts={Highcharts}
                          options={item}
                        />
                      </div>
                    ))}
                </div>
              )}
            </div>
          ) : (
            <TableList />
          )}
        </div>
        <VoiceAssistant />
      </div>
    </div>
  )
}

export default Report
