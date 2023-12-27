import React, { useMemo, useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { getDashboard } from "../Services/AuthService"
import { setMenuSlice } from "../Store/Menu/menuSlice"
import { Link } from "react-router-dom"
import { SkeletonDashboard } from "../Components/AutoLayout/Skeleton"
import { reset } from "../Store/List/listSlice"
import socket from "../Utils/SocketUtils"
import FullLoad from "./FullLoad"
import moment from "moment"
function Dashboard() {
  const dispatch = useDispatch()
  // state
  const [dashboardBox, setDashboardBox] = useState([])
  const [loader, showLoader, hideLoader] = FullLoad()

  // redux
  const userId = useSelector((state) => state.user.id)
  const activeModuleId = useSelector((state) => state.user.activeModule.id)
  const activeRoleId = useSelector((state) => state.user.activeRole.id)
  const moduleId = useSelector((state) => state.user.activeModule.id)
  const roleId = useSelector((state) => state.user.activeRole.id)
  const [date, setDate] = useState(moment())
  const [status, setStatus] = useState("CHECK IN")
  const [location, setLocation] = useState("Location")

  const fetch = async ({ activeModuleId, activeRoleId }) => {
    try {
      showLoader()
      const res = await getDashboard({
        userId,
        moduleId: activeModuleId,
        groupId: activeRoleId,
      })
      if (res.data.status == "1") {
        setDashboardBox(res.data.content)
      } else {
        throw new Error(res.data.message)
      }
    } catch (error) {
      console.log(error.message)
    } finally {
      hideLoader()
    }
  }

  useEffect(() => {
    if (activeModuleId && activeRoleId) fetch({ activeModuleId, activeRoleId })
    hideLoader()
  }, [activeModuleId, activeRoleId])

  const handleMenuClick = (dashboardItem) => {
    const { track: trackId, menuId, description: menuDesc } = dashboardItem
    dispatch(setMenuSlice({ menuId, trackId, menuDesc }))
    dispatch(reset())
  }

  // send to nodejs
  // useEffect(() => {
  //   const token = localStorage.getItem('token')
  //   const payload = { token, userId, moduleId: '60', groupId: 'AO' }
  //   socket.emit('getDashboardBox', payload)
  //   socket.on('setDashboardBox', (data) => {
  //     console.log('set data baru box')
  //     setDashboardBox(data)
  //   })
  //   socket.on('refreshDashboard', () => {
  //     socket.emit('getDashboardBox', payload)
  //   })
  // }, [])

  const checkIn = () => {
    setStatus("CHECK IN")
  }

  const checkOut = () => {
    setStatus("CHECK OUT")
  }

  useEffect(() => {
    setInterval(() => {
      setDate(moment())
    }, 1000)
  }, [])

  return (
    <div>
      <h3>Dashboard</h3>
      {/* <div className="d-flex">
        <div className="border rounded-lg shadow-lg w-50 p-2">
          <div className="d-flex justify-content-between text-bold p-2">
            <span>Presensi</span>
            <span>{date.format("LL")}</span>
          </div>
          <div className="d-flex justify-content-center text-bold text-xl text-capitalize border-bottom">
            <span>
              {date.format("hh:mm:ss a")} - {status}
            </span>
          </div>
          <div className="d-flex p-2 align-items-center">
            <i className="fas fa-map-marker text-green text-lg"></i>
            <span>{location}</span>
          </div>
          <div className="d-flex pt-3 justify-content-around">
            <button
              onClick={checkIn}
              className={`btn ${
                status == "CHECK IN" ? "btn-secondary disabled" : "btn-success"
              }`}
            >
              CHECK IN
            </button>
            <button
              onClick={checkOut}
              className={`btn ${
                status == "CHECK OUT" ? "btn-secondary disabled" : "btn-success"
              }`}
            >
              CHECK OUT
            </button>
          </div>
        </div>
      </div> */}
      {/* {!dashboardBox ? (
        <SkeletonDashboard />
      ) : (
        <div className="row">
          {dashboardBox.map((dashboardItem, index) => {
            return (
              <div className="col-lg-3 col-md-6 col-12" key={index}>
                <div className={'small-box ' + dashboardItem.class}>
                  <div className="inner">
                    <h3>{dashboardItem.total}</h3>
                    <p>{dashboardItem.description}</p>
                  </div>
                  <div className="icon">
                    <i className={dashboardItem.icon}></i>
                  </div>
                  <Link
                    to={'/'}
                    onClick={() => handleMenuClick(dashboardItem)}
                    className="small-box-footer"
                  >
                    {' '}
                    Click here to see the list{' '}
                    <i className="fas fa-arrow-circle-right"></i>
                  </Link>
                </div>
              </div>
            )
          })}
        </div>
      )} */}
      <div className="row pt-3">
        {dashboardBox.map((dashboardItem, index) => {
          return (
            <div className="col-lg-3 col-md-6 col-12" key={index}>
              <div className={"small-box " + dashboardItem.class}>
                <div className="inner">
                  <h3>{dashboardItem.total}</h3>
                  <p>{dashboardItem.description}</p>
                </div>
                <div className="icon">
                  <i className={dashboardItem.icon}></i>
                </div>
                <Link
                  to={"/"}
                  onClick={() => handleMenuClick(dashboardItem)}
                  className="small-box-footer"
                >
                  {" "}
                  Click here to see the list{" "}
                  <i className="fas fa-arrow-circle-right"></i>
                </Link>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default Dashboard
