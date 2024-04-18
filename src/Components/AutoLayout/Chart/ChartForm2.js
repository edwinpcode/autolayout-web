import React, { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import ChartService from "Services/ChartService"
import Highcharts from "highcharts"
import HighchartsReact from "highcharts-react-official"

require("highcharts/modules/accessibility")(Highcharts)

const ChartForm2 = ({ fieldItem }) => {
  const { id, label } = fieldItem

  const user = useSelector((state) => state.user)

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)

  const [data, setData] = useState([])
  const [type, setType] = useState("")

  const fetchData = () => {
    const payload = {
      userId: user.id,
      fieldId: id,
      moduleId: user.activeModule.id,
      roleId: user.activeRole.id,
    }
    console.log(payload)
    setLoading(true)
    ChartService.formChart({ payload })
      .then((res) => {
        setError(false)
        console.log(res)
        if (res.data.data) setData(res.data.data)
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
    if (id) fetchData()
  }, [id])

  return (
    <div>
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
            <div key={item.id} className="col-xl-4 col-md-6 border">
              <HighchartsReact highcharts={Highcharts} options={item} />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default ChartForm2
