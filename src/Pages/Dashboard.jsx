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
import Chart from "../Components/Dashboard/Chart"
import axios from "axios"
import { userStatus } from "../Services/UserService"
import { setDevMode } from "../Store/Dev/DevModeSlice"
import Stepper from "react-stepper-horizontal"
import classNames from "classnames"
import { useNavigate } from "react-router-dom"
import { SetActiveGroup } from "../Services/UserService"
import { setUser, setPhotoProfile } from "../Store/User/userSlice"
import Speedometer from "../Components/Dashboard/Speedometer"

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
  const [location, setLocation] = useState("")
  const [longitude, setLongitude] = useState(0)
  const [latitude, setLatitude] = useState(0)
  // const [module, setModule] = useState([])
  const module = useSelector((state) => state.module)
  const [activeStep, setActiveStep] = useState(0)
  const [selectedModule, setSelectedModule] = useState({})
  const [selectedRole, setSelectedRole] = useState({})
  const [loading, setloading] = useState(false)

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

  // useEffect(() => {
  //   console.log(module)
  // }, [module])

  const handleSelectModule = (data) => {
    setSelectedModule(data)
    // if (data.role.length === 1) {
    //   handleSelectedGroup(
    //     userId,
    //     data.role[0].groupId,
    //     data.role[0].groupName,
    //     data.id,
    //     data.name,
    //   )
    // }
    setActiveStep(1)
  }

  const handleSelectedGroup = async (
    userId,
    roleId,
    roleDescr,
    moduleId,
    moduleDescr,
  ) => {
    setloading(true)
    await SetActiveGroup({ userId, moduleId, roleId })
      .then((res) => {
        if (res.data.status == 1) {
          dispatch(
            setUser({
              userId,
              activeModule: { id: moduleId, desc: moduleDescr },
              activeRole: { id: roleId, desc: roleDescr },
            }),
          )
          dispatch(setPhotoProfile(res.data.photoProfile))
          window.location.reload()
          window.$("#authStepperModal").modal("hide")
        }
      })
      .catch((e) => {
        console.log(e)
        window.Swal.fire("Error", e.message, "error")
      })
      .finally(() => {
        setloading(false)
      })
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
          setLatitude(position.coords.latitude)
          setLongitude(position.coords.longitude)
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
        setLocation(res.data.display_name)
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
      <h3>Dashboard</h3>
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
              <span>{location}</span>
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
              <span className="card-title">Modul</span>
            </div>
            <div className="card-body">
              <div className="mb-3">
                <Stepper
                  steps={[{ title: "Pilih Modul" }, { title: "Pilih Jabatan" }]}
                  activeStep={activeStep}
                  activeColor="#5cb85c"
                  completeColor="#c0c0c0"
                />
              </div>
              {!module.length && <span>Loading...</span>}
              <div>
                {activeStep === 0 && (
                  <section>
                    <div className="row">
                      {module.map((data) => (
                        <div className="col my-2" key={data.id}>
                          <button
                            onClick={() => handleSelectModule(data)}
                            className={classNames(
                              "btn-select-module btn btn-success w-100 h-100",
                              {
                                "btn-success": data.id != activeModuleId,
                                "btn-default": data.id == activeModuleId,
                              },
                            )}
                          >
                            <span className="badge badge-danger navbar-badge position-absolute text-lg">
                              {data.totalTaskList}
                            </span>
                            <i
                              className={`${data.icon} mb-1`}
                              style={{ fontSize: 24 }}
                            ></i>
                            <div>{data.name}</div>
                          </button>
                        </div>
                      ))}
                    </div>
                  </section>
                )}
                {!loading && activeStep === 1 && (
                  <section>
                    <div className="row">
                      {selectedModule.role &&
                        selectedModule.role.map((role, index) => (
                          <div className="col my-2" key={index}>
                            <button
                              onClick={() =>
                                handleSelectedGroup(
                                  userId,
                                  role.groupId,
                                  role.groupName,
                                  selectedModule.id,
                                  selectedModule.name,
                                )
                              }
                              className={classNames("btn w-100 h-100", {
                                "btn-success": selectedRole != role,
                                "btn-default": selectedRole == role,
                              })}
                            >
                              <span className="badge badge-danger navbar-badge position-absolute text-lg">
                                {role.totalTaskList}
                              </span>
                              <i
                                className="fal fa-user mb-1"
                                style={{ fontSize: 24 }}
                              ></i>
                              <div>{role.groupName}</div>
                            </button>
                          </div>
                        ))}
                    </div>
                    <div className="row">
                      <div className="col mt-3">
                        <button
                          type="button"
                          className="btn btn-sm btn-success"
                          onClick={() => setActiveStep(0)}
                        >
                          <i className="fal fa-arrow-left"></i>
                          Kembali
                        </button>
                      </div>
                    </div>
                  </section>
                )}
                {loading && <span className="text-sx">Loading...</span>}
              </div>
            </div>
          </div>
        </div>
      </div>
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
      {userId == "admin_dev" && <Speedometer />}
    </div>
  )
}

export default Dashboard
