import axios from "axios"
import APIClient from "./APIClient"

const env = "PRODUCTION"

// Get ALL flowchart
export const getChart = async () => {
  // const result = APIClient.post('/getChart', JSON.stringify(payload))
  const payload = {}
  const result =
    process.env.REACT_APP_ENV === env
      ? APIClient.post("/getChart", payload)
      : await axios({
          method: "GET",
          url: "//localhost:5000/chart",
        })
  return result
}

export const getDrilldown = async (payload) => {
  // const result = APIClient.post('/getDrilldown', JSON.stringify(payload))
  const result =
    process.env.REACT_APP_ENV === env
      ? APIClient.post("/getDrilldown", payload)
      : await axios({
          method: "GET",
          url: "//localhost:5000/drilldown",
        })
  return result
}

const formChart = async ({ payload }) => {
  const res = await APIClient.post("/formchart", payload)
  return res
}

const ChartService = {
  getChart,
  getDrilldown,
  formChart,
}

export default ChartService
