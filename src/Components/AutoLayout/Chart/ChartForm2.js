import React, { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import ChartService from "Services/ChartService"
import Highcharts from "highcharts"
import HighchartsReact from "highcharts-react-official"

require("highcharts/modules/accessibility")(Highcharts)

const ChartForm2 = ({ fieldItem, watch }) => {
  const { id, label, width, hide } = fieldItem

  const user = useSelector((state) => state.user)

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)

  const [data, setData] = useState([])
  const [temp, setTemp] = useState([])
  const [type, setType] = useState("")

  const value = watch("DBS1001_005_002")

  const fetchData = () => {
    const payload = {
      userId: user.id,
      fieldId: value ? value : id,
      moduleId: user.activeModule.id,
      roleId: user.activeRole.id,
    }
    setLoading(true)
    ChartService.formChart({ payload })
      .then((res) => {
        setError(false)
        if (res.data.data) setTemp(res.data.data)
      })
      .catch((e) => {
        console.log(e)
        window.Swal.fire("Kesalahan", e.message, "error")
        setError(true)
      })
      .finally(() => {
        setLoading(false)
      })
  }

  useEffect(() => {
    if (temp.length) {
      const data = temp.map((item) => {
        const res = {
          ...item,
          xAxis: {
            ...item.xAxis,
            labels: {
              style: {
                fontSize: "8px",
              },
            },
          },
        }
        return res
      })
      setData(data)
    }
  }, [temp])

  useEffect(() => {
    if (value) fetchData()
  }, [value])

  useEffect(() => {
    fetchData()
  }, [])

  return (
    <div className={`col-md-${width || "12"} ${hide == "1" ? "d-none" : ""}`}>
      {label}
      {loading && (
        <div>
          <i className="fas fa-spinner fa-spin" />
          Loading...
        </div>
      )}
      {error && (
        <div>
          <div>Terjadi Kesalahan</div>
          <button
            className="btn btn-sm btn-success"
            disabled={loading}
            onClick={fetchData}
          >
            <i className="fal fa-refresh" />
            Refresh
          </button>
        </div>
      )}
      <div className="mt-3">
        <div className="row">
          {data.map((item, index) => (
            <div
              key={item.id + "_" + index}
              className={`col-md-${item.width == "12" ? "12" : "6"} col-xl-${
                item.width || "4"
              } border`}
            >
              <HighchartsReact highcharts={Highcharts} options={item} />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default ChartForm2
