import React, { useEffect, useState } from "react"
import { useQuery } from "react-query"
import { getFlowchartToolbox } from "../../Services/FLowchartService"

// node menu
const Toolbox = () => {
  const [showToolbox, setShowToolbox] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [isError, setIsError] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const [data, setData] = useState([])

  const onDragStart = (event, nodeType) => {
    event.dataTransfer.setData("application/reactflow", nodeType)
    event.dataTransfer.effectAllowed = "move"
  }

  const fetchData = async () => {
    try {
      setIsLoading(true)
      const res = await getFlowchartToolbox()
      if (res.data.status != "200") {
        throw new Error(res.data.message)
      }
      setData(res.data.toolbox)
      setIsError(false)
    } catch (e) {
      setIsError(true)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  if (isLoading) return <div>Loading...</div>
  if (isError)
    return (
      <div>
        <button onClick={fetchData} className="btn btn-success">
          Refresh
        </button>
      </div>
    )
  return (
    <div
      className="sidenav"
      id="myToolbox"
      style={{ width: showToolbox ? "200px" : "50px" }}
    >
      <div className="d-flex justify-content-between align-items-center">
        <div
          className="font-weight-bold"
          style={{ display: showToolbox ? "block" : "none" }}
        >
          Toolbox
        </div>
        {showToolbox ? (
          <button
            type="button"
            onClick={() => setShowToolbox(false)}
            className="btn btn-sm btn-light"
          >
            <i className="fas fa-bars" />
          </button>
        ) : (
          <button
            type="button"
            onClick={() => setShowToolbox(true)}
            className="btn btn-sm btn-outline-light"
          >
            <i className="fas fa-bars" />
          </button>
        )}
      </div>
      {data.map((tool, index) => (
        <div
          className="d-flex user-select-none m-1 p-1 border-bottom"
          onDragStart={(event) => onDragStart(event, tool.value)}
          draggable
          key={index}
        >
          {tool.icon !== "" ? (
            <i className={"mx-1 px-1 align-self-center " + tool.icon}></i>
          ) : (
            <i className={"align-self-center fas fa-circle"}></i>
          )}
          <div
            className="mx-1 px-1 flex-grow-1 w-100"
            style={{ display: showToolbox ? "inline-block" : "none" }}
          >
            {tool.label}
          </div>
        </div>
      ))}
    </div>
  )
}

export default Toolbox
