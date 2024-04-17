import React, { useEffect, useState, useRef } from "react"
import { useDispatch, useSelector } from "react-redux"
import { NavLink, Link, useNavigate } from "react-router-dom"
import { setMenuSlice } from "../Store/Menu/menuSlice"
import { AuthLogout } from "../Services/AuthService"
import Load from "../Pages/FullLoad"
import { useForm } from "react-hook-form"
import AIService from "../Services/AIService"
import {
  setMenuSidebarSlice,
  setSearchMenu,
} from "../Store/Menu/menuSidebarSlice"
import { converttoNewScale } from "../Utils/ConvertUtil"
import { reset, setFilteringList } from "../Store/List/listSlice"
import { useSearchParams } from "react-router-dom"
import AuthStepperContent from "../Components/Stepper/AuthStepperContent"
import Modul from "../Components/Modul/Modul"

function Header() {
  const dispatch = useDispatch()
  // redux state
  const userState = useSelector((state) => state.user)
  const userData = userState.data
  const userId = useSelector((state) => state.user.id)
  const activeModuleId = useSelector((state) => state.user.activeModule.id)
  const activeRoleId = useSelector((state) => state.user.activeRole.id)
  const [photoProfile, setPhotoProfile] = useState()
  const devMode = useSelector((state) => state.devMode)

  const { setValue, register, handleSubmit } = useForm()
  const [mediaRecorder, setMediaRecorder] = useState(null)
  const [recordingStatus, setRecordingStatus] = useState("inactive")
  const [audioUrl, setAudioUrl] = useState(null)
  const [audioBlob, setAudioBlob] = useState(null)
  const mimeType = "audio/webm"
  const [audioChunks, setAudioChunks] = useState([])
  const [mediaStream, setMediaStream] = useState(null)
  const [audioDuration, setAudioDuration] = useState(null)
  const [branchName, setBranchName] = useState("")
  const [isRecording, setIsRecording] = useState(false)
  const [border, setBorder] = useState("")
  const debounceTimeoutRef = useRef(null)
  // const [searchText, setSearchText] = useState("Cari...")
  const [searchParams, setSearchParams] = useSearchParams()
  const menuSideBar = useSelector((state) => state.menuSidebar)
  const [menu, setMenu] = useState([])
  const [filter, setFilter] = useState([])
  const searchMenu = menuSideBar.searchMenu
  // loading
  const [loader, showLoader, hideLoader] = Load()

  let navigate = useNavigate()

  const handleLogout = () => {
    showLoader()
    AuthLogout({
      userId,
      moduleId: activeModuleId,
      groupId: activeRoleId,
    })
      .then((res) => {
        if (res.data.response?.status == "1") {
          localStorage.clear()
          window.location.replace("/login")
        } else if (res.data.statusss != "1") {
          window.Swal.fire("Kesalahan", res.data.message, "error")
        }
      })
      .catch((e) => {
        window.Swal.fire("Kesalahan", e.message, "error")
      })
      .finally(() => {
        hideLoader()
      })
  }

  // useEffect(() => {
  //   console.log(userData)
  // }, [userData])

  useEffect(() => {
    const branchName = localStorage.getItem("branchName")
    if (branchName) {
      setBranchName(branchName)
    }
  }, [])

  const startRecord = () => {
    navigator.mediaDevices
      .getUserMedia({
        audio: true,
      })
      .then(async (stream) => {
        setIsRecording(true)
        setMediaStream(stream)
        const media = new MediaRecorder(stream)
        let chunks = []
        media.start()
        media.ondataavailable = (e) => {
          if (typeof e.data === "undefined") return
          if (e.data.size === 0) return
          chunks.push(e.data)
        }
        setAudioChunks(chunks)
        setMediaRecorder(media)
        setRecordingStatus("recording")
      })
      .catch((e) => {
        window.Swal.fire("Error", e.message, "error")
      })
  }

  useEffect(() => {
    if (mediaRecorder) {
      if (!isRecording) {
        stopRecord()
      }
    }
  }, [isRecording, mediaRecorder])

  const stopRecord = () => {
    if (mediaRecorder) {
      mediaRecorder.stop()
      setIsRecording(false)
      setRecordingStatus("inactive")
      mediaRecorder.onstop = async () => {
        const blob = new Blob(audioChunks, { type: mimeType })
        setAudioBlob(blob)
        const audioUrl = URL.createObjectURL(blob)
        setAudioUrl(audioUrl)
        setAudioChunks([])
        if (mediaStream) {
          mediaStream.getTracks().forEach((track) => track.stop())
          setMediaStream(null)
        }
      }
    }
  }

  useEffect(() => {
    if (!mediaStream) return
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)()
    const analyser = audioCtx.createAnalyser()
    const source = audioCtx.createMediaStreamSource(mediaStream)
    source.connect(analyser)
    analyser.fftSize = 2048
    const bufferLength = analyser.frequencyBinCount
    const dataArray = new Uint8Array(bufferLength)
    const THRESHOLD = 5 // Ambang batas kekuatan sinyal
    const draw = () => {
      if (!isRecording) return
      requestAnimationFrame(draw)

      analyser.getByteTimeDomainData(dataArray)

      const max = Math.max(...dataArray)
      const percentage = converttoNewScale(max)
      const isLoud = percentage > THRESHOLD

      if (isLoud) {
        setBorder("border-success")
        clearTimeout(debounceTimeoutRef.current)
        debounceTimeoutRef.current = null
      } else if (!debounceTimeoutRef.current) {
        setBorder("")
        debounceTimeoutRef.current = setTimeout(() => {
          if (!isLoud) {
            setIsRecording(false)
          }
        }, 4000)
      }
    }

    draw()
  }, [isRecording])

  const search = async (audioBlob) => {
    const formData = new FormData()
    const timestamp = new Date().toISOString().replace(/[-:.]/g, "")
    const randomString = Math.random().toString(36).substring(2, 5)
    const fileName = `audio_${timestamp}_${randomString}.webm`
    formData.append("file", audioBlob, fileName)
    formData.append("removewhitespace", "0")
    formData.append("userId", userId)
    formData.append("moduleId", activeModuleId)
    formData.append("roleId", activeRoleId)
    try {
      setRecordingStatus("searching")
      const res = await AIService.speechToFindMenu(formData)
      if (res.data.status == "1") {
        dispatch(setSearchMenu(res.data.message))
        if (res.data.data.length) {
          setMenu(res.data.data)
          if (res.data.filter) {
            setFilter(res.data.filter)
          }
        } else {
          setMenu([])
        }
      } else {
        window.Swal.fire("Kesalahan", "Data tidak ditemukan", "error")
      }
    } catch (error) {
      // window.Swal.fire("Kesalahan", error.message, "error")
    } finally {
      // URL.revokeObjectURL(audioUrl)
      // setAudioUrl(null)
      // setAudioBlob(null)
      setRecordingStatus("inactive")
    }
  }

  useEffect(() => {
    if (audioBlob) {
      search(audioBlob)
    }
  }, [audioBlob, audioDuration])

  useEffect(() => {
    const res = localStorage.getItem("photoProfile")
    if (res) setPhotoProfile(res)
  }, [])

  const goBack = (e) => {
    e.preventDefault()
    navigate("/", { state: { param: [] } })
  }

  const handleMenuClick = (data) => {
    const hasChild = data.child || false
    const { menuDesc, menuId, trackId, path } = data
    if (!hasChild) {
      dispatch(setMenuSlice({ menuId, trackId, menuDesc, path }))
      // dispatch(reset())
      document.getElementById("body").classList.add("sidebar-collapse")
      navigate(path)
    }
    if (hasChild) {
      const menu = document.getElementById(menuId)
      if (menu) {
        menu.classList.toggle("menu-open")
      }
    }
  }

  useEffect(() => {
    if (filter.length) {
      dispatch(setFilteringList(filter))
    }
  }, [menuSideBar, filter])

  useEffect(() => {
    if (menu.length && searchMenu != "") {
      if (menu.length && menu[0].child) {
        if (menu[0].child?.length && menu[0].child[0]?.menuId != "") {
          handleMenuClick(menu[0].child[0])
        }
      } else if (menu.length && menu[0].menuId != "") {
        handleMenuClick(menu[0])
      }
    } else if (searchMenu != "") {
      let search = searchMenu.toLowerCase()
      let item = null
      let data = menuSideBar.data
      iloop: for (let i = 0; i < data.length; i++) {
        if (data[i].child) {
          let child = data[i].child
          for (let k = 0; k < child.length; k++) {
            const menuDesc = child[k].menuDesc.toLowerCase()
            if (search.includes(menuDesc)) {
              item = child[k]
              break iloop
            }
          }
        } else {
          const menuDesc = data[i].menuDesc.toLowerCase()
          if (search.includes(menuDesc)) {
            item = data[i]
            break
          }
        }
      }
      if (item) {
        handleMenuClick(item)
      }
    }
  }, [menu, searchMenu, menuSideBar])

  return (
    <>
      <nav className="main-header navbar navbar-expand navbar-white navbar-light text-sm">
        {/* Left navbar links */}
        <ul className="navbar-nav">
          <li className="nav-item">
            <a
              className="nav-link"
              data-widget="pushmenu"
              href="#"
              role="button"
            >
              <i className="fas fa-bars"></i>
            </a>
          </li>
          {/* <li className={`nav-item ${!state.param[0]?.id ? "hidden" : ""}`}>
            <Link className="nav-link" onClick={goBack}>
              <i className="fa fa-arrow-left"></i>
              <span>Back</span>
            </Link>
          </li> */}
          {/* <li className="d-flex align-items-center">
            <span className="text-bold">{menu.activeMenuDesc}</span>
          </li> */}
          {/* <li className="nav-item">
            <Link
              className="nav-link"
              onClick={(e) => {
                e.preventDefault()
                dispatch(
                  setMenuSlice({ menuId: null, trackId: null, menuDesc: null })
                )
                navigate('/dashboard')
              }}
            >
              Dashboard
            </Link>
          </li> */}
        </ul>

        {/* Right navbar links */}
        <ul className="navbar-nav ml-auto">
          <li className="nav-item">
            {/* <div
              className="input-group"
              data-toggle="modal"
              data-target="#exampleModal"
            >
              <input
                className="form-control"
                placeholder="Cari..."
                value={""}
                onChange={() => {}}
              />
              <div
                className="input-group-append"
              >
                <div className="input-group-text">
                  <i className="fas fa-search"></i>
                </div>
              </div>
            </div> */}
            <div className={`input-group`}>
              <div
                className="input-group-prepend"
                onClick={
                  recordingStatus == "inactive" ? startRecord : stopRecord
                }
                disabled={recordingStatus == "searching"}
              >
                <div className={`input-group-text`}>
                  {recordingStatus == "searching" ? (
                    <i className="fas fa-spinner fa-spin"></i>
                  ) : recordingStatus == "inactive" ? (
                    <i className="fas fa-microphone"></i>
                  ) : (
                    <i className="fas fa-stop"></i>
                  )}
                </div>
              </div>
              <div className={`form-control form-control-lg ${border}`}>
                {searchMenu != "" ? searchMenu : "Cari..."}
              </div>
              <div
                className={`input-group-append`}
                // onClick={handleSubmit(onSubmit)}
              >
                <div className="input-group-text">
                  <i className="fas fa-search"></i>
                </div>
              </div>
            </div>
          </li>
          {/* <li className="nav-item">
            <Link
              className="nav-link"
              onClick={(e) => {
                e.preventDefault()
                dispatch(
                  setMenuSlice({
                    menuId: "",
                    trackId: "",
                    menuDesc: "",
                    path: "",
                  }),
                )
                navigate("/dashboard")
              }}
            >
              Beranda
            </Link>
          </li> */}
          <li className="nav-item">
            <Link
              className="nav-link"
              data-toggle="modal"
              data-target="#authStepperModal"
            >
              Modul
            </Link>
          </li>
          {/* <li className="nav-item dropdown">
            <a
              className="nav-link"
              href="#"
              data-toggle="dropdown"
              aria-expanded="true"
            >
              <i className="fas fa-th"></i>
            </a>
            <div className="dropdown-menu dropdown-menu-right">
              {userData?.data?.module.map((data, index) => (
                <div key={index}>
                  {data.id === userState.activeModule.id && (
                    <button
                      data-toggle="modal"
                      data-target="#authStepperModal"
                      className="dropdown-item active d-flex align-items-center justify-content-between"
                    >
                      <div className="d-flex align-items-center">
                        <i className={`${data.icon} mr-2`}></i>
                        <div
                          className="text-truncate"
                          style={{ maxWidth: 150 }}
                        >
                          {userState.activeModule.desc}
                        </div>
                      </div>
                      <span className="badge badge-danger text-xs">
                        {data.totalTaskList}
                      </span>
                    </button>
                  )}
                  {data.id !== userState.activeModule.id && (
                    <>
                      <div className="dropdown-divider"></div>
                      <button
                        data-toggle="modal"
                        data-target="#authStepperModal"
                        className="dropdown-item d-flex align-items-center justify-content-between"
                      >
                        <div className="d-flex align-items-center">
                          <i className={`${data.icon} mr-2`}></i>
                          <div
                            className="text-truncate"
                            style={{ maxWidth: 150 }}
                          >
                            {data.name}
                          </div>
                        </div>
                        <span className="badge badge-danger text-xs">
                          {data.totalTaskList}
                        </span>
                      </button>
                    </>
                  )}
                </div>
              ))}
            </div>
          </li> */}
          {/* Notifications Dropdown Menu */}
          <li className="nav-item dropdown">
            <a className="nav-link" href="#" data-toggle="dropdown">
              {/* <img
                src="https://adminlte.io/themes/v3/dist/img/user2-160x160.jpg"
                // src={photoProfile}
                className="img-circle"
                style={{ height: 35, position: 'relative', top: '-7px' }}
                alt="User..."
              /> */}
              <i className="fas fa-user"></i>
            </a>
            <div className="dropdown-menu dropdown-menu-lg dropdown-menu-right">
              <div className="p-3">
                <div className="row">
                  <div className="col-3 font-weight-bold">User</div>
                  <div className="col-9">{userData?.fullname}</div>
                </div>

                <div className="row">
                  <div className="col-3 font-weight-bold">Role</div>
                  <div className="col-9">{userState.activeRole.desc}</div>
                </div>

                <div className="row">
                  <div className="col-3 font-weight-bold">Branch</div>
                  <div className="col-9">
                    {branchName != "" ? branchName : userData?.branchName}
                  </div>
                </div>
              </div>

              <div className="dropdown-divider"></div>
              <NavLink to="/profile" className="dropdown-item">
                <i className="fas fa-user mr-2"></i> Profile
              </NavLink>
              <div className="dropdown-divider"></div>
              <a
                href="#"
                onClick={() => handleLogout()}
                className="dropdown-item"
                id="logout"
              >
                <i className="fas fa-sign-out-alt mr-2"></i> Logout
              </a>
            </div>
          </li>
        </ul>
      </nav>
      {loader}
      <div
        className="modal fade"
        id="exampleModal"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="exampleModalLabel">
                Pencarian
              </h1>
              <button
                type="button"
                className="close"
                data-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              {/* <input
                type="file"
                onChange={(e) => setAudioBlob(e.target.files[0])}
              ></input> */}
              {/* {audioUrl ? (
                <div className="mt-3">
                  <audio src={audioUrl} controls></audio>
                </div>
              ) : null} */}
              <div className="d-flex">
                {/* <div className="btn btn-success" onClick={startRecording}>
                  <i className="fas fa-microphone"></i>
                </div>
                <div className="btn btn-danger" onClick={stopRecording}>
                  <i className="fas fa-stop"></i>
                </div> */}
                <div className={`input-group mt-1`}>
                  <div
                    className="input-group-prepend"
                    onClick={
                      recordingStatus == "inactive" ? startRecord : stopRecord
                    }
                    disabled={recordingStatus == "searching"}
                  >
                    <div className={`input-group-text`}>
                      {recordingStatus == "inactive" ? (
                        <i className="fas fa-microphone"></i>
                      ) : (
                        <i className="fas fa-stop"></i>
                      )}
                    </div>
                  </div>
                  <input
                    className={`form-control form-control-lg ${border}`}
                    {...register("search")}
                  ></input>
                  <div
                    className={`input-group-append`}
                    // onClick={handleSubmit(onSubmit)}
                  >
                    <div className="input-group-text">
                      <i className="fas fa-search"></i>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              {/* <button
                className="btn btn-secondary"
                onClick={downloadAudio}
                disabled={!audioBlob}
              >
                Download
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={search}
              >
                Upload
              </button> */}
            </div>
          </div>
        </div>
      </div>
      <div
        className="modal fade"
        id="authStepperModal"
        aria-labelledby="authStepperModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Modul</h5>
              <button
                type="button"
                className="close"
                data-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <Modul />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Header
