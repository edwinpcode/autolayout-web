import React, { useEffect, useState, useRef } from "react"
import { useDispatch, useSelector } from "react-redux"
import { NavLink, Link, useNavigate, useLocation } from "react-router-dom"
import { setMenuSlice } from "../Store/Menu/menuSlice"
import { AuthLogout } from "../Services/AuthService"
import Load from "../Pages/FullLoad"
import { useForm } from "react-hook-form"
import AIService from "../Services/AIService"

function Header() {
  const dispatch = useDispatch()
  // redux state
  const userState = useSelector((state) => state.user)
  const userData = userState.data
  const userId = useSelector((state) => state.user.id)
  const activeModuleId = useSelector((state) => state.user.activeModule.id)
  const activeRoleId = useSelector((state) => state.user.activeRole.id)
  const [photoProfile, setPhotoProfile] = useState()
  const menu = useSelector((state) => state.menu)
  const { state } = useLocation()

  const { setValue, register } = useForm()
  const mediaRecorder = useRef(null)
  const [recordingStatus, setRecordingStatus] = useState("inactive")
  const [audioUrl, setAudioUrl] = useState(null)
  const [audioBlob, setAudioBlob] = useState(null)
  const mimeType = "audio/wav"
  const [searchResult, setSearchResult] = useState("")
  const [audioChunks, setAudioChunks] = useState([])
  const [mediaStream, setMediaStream] = useState(null)
  const [recorder, setRecorder] = useState(null)

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

  const startRecording = () => {
    navigator.mediaDevices
      .getUserMedia({
        audio: {
          sampleRate: 16000,
          channelCount: 1,
        },
      })
      .then(async (stream) => {
        setMediaStream(stream)
        mediaRecorder.current = new MediaRecorder(stream)
        const chunks = []
        mediaRecorder.current.start()
        mediaRecorder.current.ondataavailable = (e) => {
          chunks.push(e.data)
        }

        setAudioChunks(chunks)
        setRecordingStatus("recording")
      })
      .catch((e) => {
        window.Swal.fire("Error", e.message, "error")
      })
  }

  const stopRecording = () => {
    if (
      mediaRecorder &&
      mediaRecorder.current.state !== "inactive" &&
      mediaStream
    ) {
      mediaRecorder.current.stop()
      setRecordingStatus("inactive")
      mediaRecorder.current.onstop = async () => {
        const blob = new Blob(audioChunks, { type: mimeType })
        setAudioBlob(blob)
        const audioUrl = URL.createObjectURL(blob)
        setAudioUrl(audioUrl)
        setAudioChunks([])
        mediaStream.getTracks().forEach((track) => track.stop())
        setMediaStream(null)
      }
    }
  }

  const search = async () => {
    const formData = new FormData()
    if (audioBlob) {
      const file = new File([audioBlob], "record.wav", {
        type: mimeType,
      })
      formData.append("file", file)
      console.log(formData)
      try {
        const res = await AIService.voiceToText(formData)
        if (res.data.status == "1") {
          setValue("search", res.data.message)
          setSearchResult(res.data.message)
        }
      } catch (error) {
        console.log(error)
        window.Swal.fire("Kesalahan", error.message, "error")
      }
    }
  }

  useEffect(() => {
    const res = localStorage.getItem("photoProfile")
    if (res) setPhotoProfile(res)
  }, [])

  const goBack = (e) => {
    e.preventDefault()
    // navigate(`/${menuId}`)
    navigate("/", { state: { param: [] } })
  }

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
            <div
              className="input-group"
              data-toggle="modal"
              data-target="#exampleModal"
            >
              <input
                className="form-control"
                // {...register("search")}
                placeholder="Cari..."
                // disabled
                value={""}
                onChange={() => {}}
              />
              <div
                className="input-group-append"
                // onClick={getMicrophonePermission}
                // data-toggle="modal"
                // data-target="#exampleModal"
              >
                <div className="input-group-text">
                  <i className="fas fa-search"></i>
                </div>
              </div>
              {/* {permission && (
                <div className="input-group-append">
                  <button
                    type="button"
                    data-toggle="modal"
                    data-target="#exampleModal"
                    className="btn btn-sm btn-secondary"
                  >
                    <i className="fas fa-microphone"></i>
                  </button>
                </div>
              )} */}
            </div>
          </li>
          <li className="nav-item">
            <Link
              className="nav-link"
              onClick={(e) => {
                e.preventDefault()
                dispatch(
                  setMenuSlice({ menuId: null, trackId: null, menuDesc: null }),
                )
                navigate("/dashboard")
              }}
            >
              Dashboard
            </Link>
          </li>
          <li className="nav-item dropdown">
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
          </li>
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
                  <div className="col-9">{userData?.branchName}</div>
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
              <input
                type="file"
                onChange={(e) => setAudioBlob(e.target.files[0])}
              ></input>
              {recordingStatus === "inactive" && (
                <div className="btn btn-success" onClick={startRecording}>
                  <i className="fas fa-microphone"></i>
                </div>
              )}
              {recordingStatus === "recording" && (
                <div className="btn btn-danger" onClick={stopRecording}>
                  <i className="fas fa-stop"></i>
                </div>
              )}
              {audioUrl ? (
                <div className="mt-3">
                  <audio src={audioUrl} controls></audio>
                </div>
              ) : null}
              <div className="input-group mt-3">
                <input className="form-control" {...register("search")}></input>
                <div className="input-group-append">
                  <div className="input-group-text">
                    <i className="fas fa-search"></i>
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <a className="btn btn-secondary" download href={audioUrl}>
                Download Recording
              </a>
              <button
                type="button"
                className="btn btn-primary"
                onClick={search}
              >
                Upload
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Header
