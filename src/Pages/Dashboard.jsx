import React, { useState, useEffect, lazy, Suspense } from "react"
import { useDispatch, useSelector } from "react-redux"
import { getDashboard } from "../Services/AuthService"
import { setMenuSlice } from "../Store/Menu/menuSlice"
import { Link } from "react-router-dom"
import { reset } from "../Store/List/listSlice"
import FullLoad from "./FullLoad"
import moment from "moment"
import axios from "axios"
import { userStatus } from "../Services/UserService"
import { useNavigate } from "react-router-dom"
// import Modul from "../Components/Modul"
import { setAddress, setLatitude, setLongitude } from "../Store/locationSlice"

const Modul = lazy(() => import("Components/Modul/Modul"))
const ModulAll = lazy(() => import("Components/Modul/ModulAll"))

function Dashboard() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const devMode = useSelector((state) => state.devMode)

  // state
  const [dashboardBox, setDashboardBox] = useState([])
  const [loader, showLoader, hideLoader] = FullLoad()

  // redux
  const userId = useSelector((state) => state.user.id)
  const activeModuleId = useSelector((state) => state.user.activeModule.id)
  const activeRoleId = useSelector((state) => state.user.activeRole.id)
  const moduleId = useSelector((state) => state.user.activeModule.id)
  const roleId = useSelector((state) => state.user.activeRole.id)
  const [date, setDate] = useState(null)
  const [status, setStatus] = useState("")
  const latitude = useSelector((state) => state.location.latitude)
  const longitude = useSelector((state) => state.location.longitude)
  const address = useSelector((state) => state.location.address)
  // const [location, setLocation] = useState("")
  // const [longitude, setLongitude] = useState(0)
  // const [latitude, setLatitude] = useState(0)
  // const [module, setModule] = useState([])

  const [fieldItem, setFieldItem] = useState({
    hide: "0",
    id: "123123",
    value: "",
    button: [
      {
        id: "123123",
        path: "/sample",
      },
    ],
  })

  const fetch = async ({ activeModuleId, activeRoleId }) => {
    try {
      showLoader()
      const res = await getDashboard({
        userId,
        moduleId: activeModuleId,
        groupId: activeRoleId,
      })
      if (res.data.content) {
        setDashboardBox(res.data.content)
      }
      // if (res.data.data?.module) {
      //   setModule(res.data.data.module)
      // }
    } catch (error) {
      console.log(error.message)
    } finally {
      hideLoader()
    }
  }

  const cekStatus = async (presensiType) => {
    // -presensiType: checkin,checkout,checkstatus
    try {
      const res = await userStatus({ userid: userId, presensiType })
      if (res.data.status == "1") {
        if (
          res.data.message &&
          res.data.message.toLowerCase().includes("already")
        ) {
          setStatus(res.data.message)
        } else {
          setStatus(res.data.message)
          window.Swal.fire("Berhasil", res.data.message, "success")
          // if (res.data.message.toLowerCase().includes("out")) {
          //   const logout = document.getElementById("logout")
          //   if (logout) {
          //     logout.click()
          //   }
          // }
        }
        // 2023-12-29 15:47:00
        if (res.data.statusTime && res.data.statusTime != "") {
          const date = moment(res.data.statusTime, "YYYY-MM-DD HH:mm:ss")
          setDate(date)
        }
      } else {
        window.Swal.fire("Peringatan", res.data.message, "warning")
        setStatus(res.data.message)
        // if (res.data.message.toLowerCase().includes("already")) {
        //   window.Swal.fire("Peringatan", res.data.message, "warning")
        // } else {
        //   window.Swal.fire({
        //     title: "Presensi",
        //     html: "Lakukan Check In?",
        //     icon: "warning",
        //     showCancelButton: true,
        //     confirmButtonColor: "#5cb85c",
        //     cancelButtonColor: "#d33",
        //     cancelButtonText: "Keluar",
        //     confirmButtonText: "IYA",
        //     allowOutsideClick: false,
        //     allowEscapeKey: false,
        //   }).then((res) => {
        //     if (res.isConfirmed) {
        //       cekStatus("checkin")
        //     } else {
        //       const logout = document.getElementById("logout")
        //       if (logout) {
        //         logout.click()
        //       }
        //     }
        //   })
        // }
      }
    } catch (e) {
      window.Swal.fire("Error", e.message, "error")
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

  const fetchLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          dispatch(setLatitude(position.coords.latitude))
          dispatch(setLongitude(position.coords.longitude))
        },
        (err) => {
          console.log(err.message)
        },
      )
    } else {
      console.log("Location unavailable")
    }
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
    cekStatus("checkin")
    // setStatus("CHECK IN")
    // setDate(moment())
  }

  const checkOut = () => {
    cekStatus("checkout")
    // setStatus("CHECK OUT")
    // setDate(moment())
  }

  const getAddress = async ({ longitude, latitude }) => {
    try {
      const res = await axios.get(
        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`,
      )
      if (res.data && res.data.display_name) {
        dispatch(setAddress(res.data.display_name))
      }
    } catch (error) {
      console.error("Error fetching address:", error)
    }
  }

  useEffect(() => {
    if (longitude && latitude) getAddress({ longitude, latitude })
  }, [latitude, longitude])

  useEffect(() => {
    // setInterval(() => {
    //   setDate(moment())
    // }, 1000)
    fetchLocation()
    cekStatus("checkstatus")
  }, [])

  return (
    <div>
      <h3>Beranda</h3>
      <div className="row">
        <div className="col-lg-6">
          <div className="p-2 rounded-lg border shadow-sm h-100 mb-3">
            <div className="d-flex justify-content-between text-bold p-2">
              <span>Presensi</span>
              <span>{date?.format("LL")}</span>
            </div>
            <div className="d-flex justify-content-center text-bold text-xl text-capitalize border-bottom">
              <span>
                {date?.format("hh:mm a")} - {status}
              </span>
            </div>
            <div className="d-flex p-2 align-items-center">
              <i className="fas fa-map-marker text-green text-lg"></i>
              <span>{address}</span>
            </div>
            <div className="d-flex pt-3 justify-content-around">
              <button
                onClick={checkIn}
                disabled={
                  status == ""
                    ? true
                    : status.toLowerCase().includes("already")
                      ? true
                      : status.toLocaleLowerCase().includes("check in berhasil")
                        ? true
                        : false
                }
                className={`btn ${
                  status == ""
                    ? "btn-secondary"
                    : status.toLowerCase().includes("already")
                      ? "btn-secondary"
                      : status.toLocaleLowerCase().includes("check in berhasil")
                        ? "btn-secondary"
                        : "btn-success"
                }`}
              >
                CHECK IN
              </button>
              <button
                onClick={checkOut}
                disabled={
                  status == ""
                    ? true
                    : status.toLowerCase().includes("please")
                      ? true
                      : status.toLowerCase().includes("check out")
                        ? true
                        : false
                }
                className={`btn ${
                  status == ""
                    ? "btn-secondary"
                    : status.toLowerCase().includes("please")
                      ? "btn-secondary"
                      : status.toLocaleLowerCase().includes("check out")
                        ? "btn-secondary"
                        : "btn-success"
                }`}
              >
                CHECK OUT
              </button>
            </div>
          </div>
        </div>
        <div className="col-lg-6">
          <div className="card card-success">
            <div className="card-header">
              <span className="card-title">Role</span>
            </div>
            <div className="card-body">
              <Suspense>
                {/* <Modul /> */}
                <ModulAll />
              </Suspense>
            </div>
          </div>
        </div>
      </div>
      {/* <div className="row pt-3">
        <InputTextWithAudio fieldItem={fieldItem} button={fieldItem.button} />
      </div> */}
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
                  Click here to see the list
                  <i className="fas fa-arrow-circle-right ml-2"></i>
                </Link>
              </div>
            </div>
          )
        })}
      </div>
      {/* <Chart /> */}
      {/* {loader} */}
      {/* {userId == "admin_dev" && <Speedometer />} */}
    </div>
  )
}

export default Dashboard
