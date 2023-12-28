import { ErrorMessage } from "@hookform/error-message"
import moment from "moment"
import React, { useEffect, useState, useRef } from "react"
import { useForm } from "react-hook-form"
import { useNavigate } from "react-router-dom"
import { AuthLogin } from "../Services/AuthService"
import { encryptAES } from "../Utils/EncryptUtils"
import Logo from "./Logo"
import { useDispatch } from "react-redux"
import { setUser, setUserId } from "../Store/User/userSlice"
// import {
//   loadCaptchaEnginge,
//   LoadCanvasTemplate,
//   LoadCanvasTemplateNoReload,
//   validateCaptcha,
// } from 'react-simple-captcha'

const metaTags = document.getElementsByTagName("meta")
const metaTagsArray = Array.from(metaTags)

const applicationNameTag = metaTagsArray.find((tag) => {
  return tag.getAttribute("name") === "login-application-name"
})

const loginApplicationName = applicationNameTag.getAttribute("content")

function Login() {
  // load login
  const [isLoading, setLoading] = useState(false)
  // show hide password
  const [passwordShown, setPasswordShown] = useState(false)
  const togglePasswordVisiblity = () => {
    setPasswordShown(passwordShown ? false : true)
  }
  const canvasRef = useRef(null)
  const [compareCaptcha, setCompareCaptcha] = useState("")
  const [devMode, setDevMode] = useState(false)
  const [photo, setPhoto] = useState(null)
  const [showVideo, setShowVideo] = useState(false)

  const navigate = useNavigate()
  const {
    reset,
    setValue,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ mode: "onChange" })
  const videoRef = useRef(null)
  const canvasCameraRef = useRef(null)
  const [mediaStream, setMediaStream] = useState(null)

  const dispatch = useDispatch()

  const listFont = [
    "Georgia",
    // 'Times New Roman',
    // 'Arial',
    // 'Verdana',
    "Courier New",
    // 'serif',
    // 'sans-serif',
  ]

  const handleCanvas = () => {
    var charsArray =
      "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ@!#$%^&*"
    var lengthOtp = 6
    var captcha = []
    for (var i = 0; i < lengthOtp; i++) {
      //below code will not allow Repetition of Characters
      var index = Math.floor(Math.random() * charsArray.length + 1) //get the next character from the array
      if (captcha.indexOf(charsArray[index]) == -1)
        captcha.push(charsArray[index])
      else i--
    }
    const random = Math.floor(Math.random() * listFont.length)
    const selectFont = listFont[random]
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext("2d")
      const cap = captcha.join("")
      ctx.font = `30px ${selectFont}`
      ctx.strokeText(cap, 5, 30)
      setCompareCaptcha(cap)
    }
  }

  useEffect(() => {
    handleCanvas()
    if (process.env.NODE_ENV === "development") {
      setDevMode(true)
    }
  }, [])

  const resetCanvas = () => {
    setValue("captcha", "")
    if (canvasRef.current) {
      const context = canvasRef.current.getContext("2d")
      context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)
      handleCanvas()
    }
  }

  const getSecretKeyByDate = () => {
    const currentDate = moment().locale("en")
    const formattedDate = currentDate.format("dddYYYYMMDD")
    return formattedDate + "00000"
  }

  const handleLogin = ({ userId, password, captcha }) => {
    // if (!validateCaptcha(captcha)) {
    //   return window.Swal.fire('Error', 'Wrong captcha', 'error')
    // }
    if (captcha !== compareCaptcha && !devMode) {
      resetCanvas()
      return window.Swal.fire("Error", "Wrong captcha", "error")
    }
    setLoading(true)
    const secret = getSecretKeyByDate()
    const encrypted = encryptAES(password, secret)
    AuthLogin(userId, encrypted)
      .then((res) => {
        if (res.response.status === "1") {
          localStorage.setItem("accessToken", res.response.accessToken)
          localStorage.setItem("refreshToken", res.response.refreshToken)
          localStorage.setItem("expiredIn", res.response.expiredIn)
          localStorage.setItem("userId", res.response.userId)
          window.location = "/auth"
          dispatch(setUserId(res.response.userId))
        } else {
          resetCanvas()
          setLoading(false)
          window.Swal.fire("Kesalahan", res.response.message, "error")
        }
      })
      .catch((err) => {
        resetCanvas()
        setLoading(false)
        window.Swal.fire(
          "Peringatan",
          "Mohon maaf, sedang terjadi kendala koneksi pada sistem, silahkan coba kembali secara berkala",
          "error",
        )
      })
  }

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true })
      setShowVideo(true)
      if (videoRef.current) {
        setMediaStream(stream)
        videoRef.current.srcObject = stream
      }
    } catch (error) {
      console.error("Error accessing camera:", error)
    }
  }

  const takePhoto = () => {
    if (videoRef.current) {
      const video = videoRef.current
      const canvas = canvasCameraRef.current
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      const ctx = canvas.getContext("2d")
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
      const photoData = canvas.toDataURL("image/png")
      setPhoto(photoData)
      if (mediaStream) {
        setShowVideo(false)
        mediaStream.getTracks().forEach((track) => track.stop())
        setMediaStream(null)
      }
    }
  }

  useEffect(() => {
    // loadCaptchaEnginge(6)
  }, [])

  return (
    <div className="position-relative">
      <div className="login-page">
        <div className="login-box border-danger">
          <div className="d-flex justify-content-between rounded bg-white p-4 shadow-lg">
            <div className="w-100 mr-2">
              <div className="login-logo">
                <Logo />
              </div>
              <form onSubmit={handleSubmit(handleLogin)}>
                <div className="mb-3">
                  {/* <label htmlFor="username">NIK</label> */}
                  <div className="input-group">
                    <input
                      type="text"
                      id="username"
                      className="form-control"
                      placeholder="NIK"
                      {...register("userId", {
                        required: "NIK is required",
                        minLength: {
                          value: 4,
                          message: "Username length minimum 4",
                        },
                      })}
                      autoComplete="off"
                    />
                    <div className="input-group-append">
                      <div className="input-group-text">
                        <span className="fas fa-user" />
                      </div>
                    </div>
                  </div>
                  <ErrorMessage
                    errors={errors}
                    name="userId"
                    as={<span className="text-danger text-xs"></span>}
                  />
                </div>
                <div className="mb-3">
                  <div className="input-group">
                    <input
                      type={passwordShown ? "text" : "password"}
                      className="form-control"
                      placeholder="Kata Sandi"
                      {...register("password", {
                        required: "Password required",
                        minLength: {
                          value: 8,
                          message: "password length minimum 8",
                        },
                      })}
                    />
                    <div className="input-group-append">
                      <div className="input-group-text">
                        {!passwordShown && (
                          <span
                            className="fas fa-lock"
                            onClick={togglePasswordVisiblity}
                          />
                        )}
                        {passwordShown && (
                          <span
                            className="fas fa-unlock"
                            onClick={togglePasswordVisiblity}
                          />
                        )}{" "}
                      </div>
                    </div>
                  </div>
                  <ErrorMessage
                    errors={errors}
                    name="password"
                    as={<span className="text-danger text-xs"></span>}
                  />
                </div>
                {/* <LoadCanvasTemplate /> */}
                <div className={`${devMode ? "d-none" : "d-flex"}`}>
                  <canvas
                    ref={canvasRef}
                    height={50}
                    width={150}
                    className="pr-3"
                  />
                  <button
                    className="btn btn-sm btn-secondary"
                    onClick={resetCanvas}
                  >
                    Reload
                  </button>
                </div>
                {!devMode && (
                  <div className={`mb-3 mt-3`}>
                    <div className="form-group">
                      <input
                        type="text"
                        className="form-control"
                        id="captcha"
                        {...register("captcha", {
                          required: "Captcha Required",
                        })}
                        autoComplete="off"
                      />
                    </div>
                    <ErrorMessage
                      errors={errors}
                      name="captcha"
                      as={<span className="text-danger text-xs"></span>}
                    />
                  </div>
                )}
                <div className="">
                  <button
                    type="submit"
                    className="btn btn-success btn-block btn-lg"
                    disabled={isLoading}
                  >
                    {isLoading && <i className="fas fa-spinner fa-spin"></i>}
                    MASUK
                  </button>
                  <button className="btn btn-outline-success btn-block btn-lg">
                    <span className="">LUPA KATA SANDI ?</span>
                  </button>
                </div>
              </form>
            </div>
            {/* <div className="w-50 ml-2">
              <video
                ref={videoRef}
                autoPlay
                muted
                style={{
                  display: showVideo ? "block" : "none",
                  maxWidth: "100%",
                }}
                className="mt-3"
              />
              <canvas ref={canvasCameraRef} style={{ display: "none" }} />
              {photo && !showVideo && (
                <img src={photo} className="w-100 mt-3"></img>
              )}
              {!showVideo ? (
                <button
                  className="btn btn-success mt-3 btn-block"
                  onClick={startCamera}
                >
                  Take Photo
                </button>
              ) : (
                <button
                  className="btn btn-success mt-3 btn-block"
                  onClick={takePhoto}
                >
                  Take Photo
                </button>
              )}
              {photo && (
                <a className="btn btn-success btn-block" download href={photo}>
                  Download
                </a>
              )}
            </div> */}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
