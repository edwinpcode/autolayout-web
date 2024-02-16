import React, { useEffect, useState } from "react"
import Highcharts from "highcharts"
import HighchartsReact from "highcharts-react-official"
import Tab from "../Components/AutoLayout/Tab"
import TableList from "./TableList"
import { axiosPost } from "../Services/AutoLayoutService"
import { useSelector } from "react-redux"
import ReactSpeedometer from "react-d3-speedometer"

const tab = [
  { id: "chart", label: "Chart" },
  { id: "table", label: "Table" },
]

function Report() {
  const [options, setOptions] = useState([])
  const [data, setdata] = useState({})
  const [activeTabId, setActiveTabId] = useState("chart")
  // redux
  const user = useSelector((state) => state.user)
  const menu = useSelector((state) => state.menu)

  const getChartOption = async (menu) => {
    const payload = {
      userId: user.id,
      menuId: menu.activeMenuId,
      moduleId: user.activeModule.id,
      roleId: user.activeRole.id,
    }
    await axiosPost("/reportchart", payload)
      .then((res) => {
        if (res.data.status == "1") {
          setOptions(res.data.data)
        } else {
          window.Swal.fire("Kesalahan", res.data.message, "error")
        }
      })
      .catch((e) => {
        window.Swal.fire("Kesalahan", e.message, "error")
      })
  }

  // useEffect(() => {
  //   console.log(options)
  // }, [options])

  useEffect(() => {
    getChartOption(menu)
  }, [menu])

  return (
    <div>
      <div className="mb-3">
        <Tab
          data={tab}
          activeTabId={activeTabId}
          setActiveTabId={setActiveTabId}
        />
      </div>
      {activeTabId === "chart" ? (
        <div className="row">
          {options.map((item, index) => {
            if (item.segment)
              return (
                <div className="col-xl-4 col-md-6 border" key={index}>
                  <div>
                    <div>{item.title}</div>
                  </div>
                  <ReactSpeedometer
                    maxValue={item.maxValue}
                    value={item.value}
                    currentValueText={item.label}
                    needleHeightRatio={0.5}
                    maxSegmentLabels={5}
                    needleTransitionDuration={4000}
                    needleTransition="easeElastic"
                    customSegmentLabels={item.segment}
                    height={250}
                    width={400}
                  />
                  <div>
                    <div>{item.description}</div>
                  </div>
                </div>
              )
            return (
              <div className="col-xl-4 col-md-6 border" key={index}>
                <HighchartsReact highcharts={Highcharts} options={item} />
              </div>
            )
          })}
        </div>
      ) : (
        <TableList />
      )}
    </div>
  )
}

export default Report
