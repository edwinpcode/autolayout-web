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
import axios from "axios"
import AIService from "../Services/AIService"
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
  const [photoURI, setPhotoURI] = useState(null)
  const [photoURI2, setPhotoURI2] = useState(null)
  const [showVideo, setShowVideo] = useState(false)
  const [longitude, setLongitude] = useState(0)
  const [latitude, setLatitude] = useState(0)
  const [address, setAddress] = useState("")

  const navigate = useNavigate()
  const {
    reset,
    setValue,
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({ mode: "onChange" })
  const videoRef = useRef(null)
  const canvasCameraRef = useRef(null)
  const [mediaStreamVideo, setMediaStreamVideo] = useState(null)
  const [mediaStreamAudio, setMediaStreamAudio] = useState(null)
  const mediaRecorder = useRef(null)
  const [recordingStatus, setRecordingStatus] = useState("inactive")
  const [audioUrl, setAudioUrl] = useState(null)
  const [audioBlob, setAudioBlob] = useState(null)
  const mimeType = "audio/webm"
  const [audioChunks, setAudioChunks] = useState([])
  const [useCamera, setUseCamera] = useState(false)
  const [flipped, setFlipped] = useState(false)
  const [imageSource, setImageSource] = useState("camera")
  const [photo, setPhoto] = useState(null)

  const dispatch = useDispatch()

  // const { photo } = watch()

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
  const handleFileInput = (e) => {
    const file = e.target.files[0]
    setPhoto(file)
    const uri = URL.createObjectURL(file)
    setPhotoURI2(uri)
    if (mediaStreamVideo) {
      setShowVideo(false)
      mediaStreamVideo.getTracks().forEach((track) => track.stop())
      setMediaStreamVideo(null)
    }
  }

  // useEffect(() => {
  //   resetForm()
  // }, [imageSource])

  const getSecretKeyByDate = () => {
    const currentDate = moment().locale("en")
    const formattedDate = currentDate.format("dddYYYYMMDD")
    return formattedDate + "00000"
  }

  const handleLogin = ({ userId, password, captcha }) => {
    // if (!validateCaptcha(captcha)) {
    //   return window.Swal.fire('Error', 'Wrong captcha', 'error')
    // }
    if (captcha !== compareCaptcha && !devMode && !useCamera) {
      resetCanvas()
      return window.Swal.fire("Error", "Wrong captcha", "error")
    }
    setLoading(true)
    if (useCamera) {
      if (!photoURI && imageSource == "camera") {
        setLoading(false)
        return window.Swal.fire("Error", "Ambil Foto", "error")
      }
      if (!photo?.name && imageSource == "file") {
        setLoading(false)
        return window.Swal.fire("Error", "pilih Foto", "error")
      }
      const blob = imageSource == "camera" ? dataURItoBlob(photoURI) : photo
      const timestamp = new Date().toISOString().replace(/[-:.]/g, "")
      const randomString = Math.random().toString(36).substring(2, 5)
      const formData = new FormData()
      formData.append("id_user", userId)
      formData.append("image", blob, `photo_${timestamp}_${randomString}.png`)
      AIService.faceRecognize(formData)
        .then((res) => {
          console.log(res.data)
          if (res.data.status === "1") {
            localStorage.setItem("accessToken", res.data.accessToken)
            localStorage.setItem("refreshToken", res.data.refreshToken)
            localStorage.setItem("expiredIn", res.data.expiredIn)
            localStorage.setItem("userId", res.data.userId)
            dispatch(setUserId(res.data.userId))
            window.location = "/auth"
          } else {
            resetCanvas()
            window.Swal.fire("Kesalahan", res.data.message, "error")
            resetForm()
          }
        })
        .catch((e) => {
          resetCanvas()
          window.Swal.fire(
            "Peringatan",
            "Mohon maaf, sedang terjadi kendala koneksi pada sistem, silahkan coba kembali secara berkala",
            "error",
          )
          resetForm()
        })
        .finally(() => {
          setLoading(false)
        })
    } else {
      const secret = getSecretKeyByDate()
      const encrypted = encryptAES(password, secret)
      const payload = {
        userId: userId,
        password: encrypted,
        longitude: longitude,
        latitude: latitude,
        address: address,
      }
      AuthLogin(payload)
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
            window.Swal.fire("Kesalahan", res.response.message, "error")
          }
        })
        .catch((err) => {
          resetCanvas()
          window.Swal.fire(
            "Peringatan",
            "Mohon maaf, sedang terjadi kendala koneksi pada sistem, silahkan coba kembali secara berkala",
            "error",
          )
        })
        .finally(() => {
          setLoading(false)
        })
    }
  }

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true })
      setPhotoURI(null)
      setShowVideo(true)
      if (videoRef.current) {
        setMediaStreamVideo(stream)
        videoRef.current.srcObject = stream
      }
    } catch (error) {
      console.error("Error accessing camera:", error)
    }
  }

  const resetForm = () => {
    if (photo) {
      setPhoto(null)
    }
    if (photoURI2) {
      URL.revokeObjectURL(photoURI2)
      setPhotoURI2(null)
    }
    // if (photoURI) {
    //   setPhotoURI(null)
    // }
    if (imageSource == "camera") {
      setUseCamera(true)
    }
  }

  useEffect(() => {
    if (!useCamera) {
      if (mediaStreamVideo) {
        setShowVideo(false)
        mediaStreamVideo.getTracks().forEach((track) => track.stop())
        setMediaStreamVideo(null)
      }
      if (photo) {
        setPhoto(null)
      }
      if (photoURI2) {
        URL.revokeObjectURL(photoURI2)
        setPhotoURI2(null)
      }
    }
  }, [useCamera, mediaStreamVideo, photo, photoURI, photoURI2])

  useEffect(() => {
    if (useCamera) {
      startCamera()
    }
  }, [useCamera])

  const takePhoto = () => {
    if (videoRef.current) {
      const video = videoRef.current
      const canvas = canvasCameraRef.current
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      const ctx = canvas.getContext("2d")
      if (flipped) {
        ctx.translate(canvas.width, 0)
        ctx.scale(-1, 1)
      }
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
      if (flipped) {
        ctx.setTransform(1, 0, 0, 1, 0, 0)
      }
      const photoData = canvas.toDataURL("image/png")
      setPhotoURI(photoData)
      if (mediaStreamVideo) {
        setShowVideo(false)
        mediaStreamVideo.getTracks().forEach((track) => track.stop())
        setMediaStreamVideo(null)
      }
    }
  }

  const dataURItoBlob = (dataURI) => {
    const byteString = atob(dataURI.split(",")[1])
    const mimeString = dataURI.split(",")[0].split(":")[1].split(";")[0]
    const ab = new ArrayBuffer(byteString.length)
    const ia = new Uint8Array(ab)
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i)
    }
    return new Blob([ab], { type: mimeString })
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
    }
  }

  const getAddress = async ({ longitude, latitude }) => {
    try {
      const res = await axios.get(
        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`,
      )
      if (res.data && res.data.display_name) {
        setAddress(res.data.display_name)
      }
    } catch (error) {
      console.error("Error fetching address:", error)
    }
  }

  useEffect(() => {
    if (longitude && latitude) getAddress({ longitude, latitude })
  }, [latitude, longitude])

  useEffect(() => {
    // loadCaptchaEnginge(6)
    fetchLocation()
  }, [])

  const startRecord = () => {
    navigator.mediaDevices
      .getUserMedia({
        audio: {
          sampleRate: 16000,
          channelCount: 1,
        },
      })
      .then(async (stream) => {
        setMediaStreamAudio(stream)
        const media = new MediaRecorder(stream)
        mediaRecorder.current = media
        let chunks = []
        mediaRecorder.current.start()
        mediaRecorder.current.ondataavailable = (e) => {
          if (typeof e.data === "undefined") return
          if (e.data.size === 0) return
          chunks.push(e.data)
        }
        setAudioChunks(chunks)
        setRecordingStatus("recording")
      })
      .catch((e) => {
        window.Swal.fire("Error", e.message, "error")
      })
  }

  const stopRecord = () => {
    if (mediaRecorder) {
      mediaRecorder.current.stop()
      setRecordingStatus("inactive")
      mediaRecorder.current.onstop = async () => {
        const blob = new Blob(audioChunks, { type: mimeType })
        setAudioBlob(blob)
        const audioUrl = URL.createObjectURL(blob)
        setAudioUrl(audioUrl)
        setAudioChunks([])
        if (mediaStreamAudio) {
          mediaStreamAudio.getTracks().forEach((track) => track.stop())
          setMediaStreamAudio(null)
        }
      }
    }
  }

  const search = async (audioBlob) => {
    const formData = new FormData()
    const timestamp = new Date().toISOString().replace(/[-:.]/g, "")
    const randomString = Math.random().toString(36).substring(2, 5)
    const fileName = `audio_${timestamp}_${randomString}.webm`
    formData.append("file", audioBlob, fileName)
    try {
      setRecordingStatus("search")
      const res = await AIService.voiceToText(formData)
      if (res.data.status == "1") {
        setValue("userId", res.data.message)
      }
      URL.revokeObjectURL(audioUrl)
      setAudioUrl(null)
      setAudioBlob(null)
    } catch (error) {
      window.Swal.fire("Kesalahan", error.message, "error")
    } finally {
      setRecordingStatus("inactive")
    }
  }

  useEffect(() => {
    setShowVideo(false)
    if (mediaStreamVideo) {
      mediaStreamVideo.getTracks().forEach((track) => track.stop())
      setMediaStreamVideo(null)
    }
  }, [imageSource])

  useEffect(() => {
    if (audioBlob) {
      search(audioBlob)
    }
  }, [audioBlob])

  return (
    <div className="position-relative">
      <div className="login-page">
        <div className={`login-box border-danger ${useCamera ? "w-75" : ""}`}>
          <div className={`row rounded bg-white p-4 shadow-lg`}>
            <div className={`${useCamera ? "col-md-6" : "w-100"}`}>
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
                    <div
                      className="input-group-append"
                      onClick={
                        recordingStatus == "inactive" ? startRecord : stopRecord
                      }
                      disabled={recordingStatus == "search"}
                    >
                      <div className="input-group-text">
                        {recordingStatus == "search" ? (
                          <i className="fas fa-spinner fa-spin"></i>
                        ) : recordingStatus == "inactive" ? (
                          <i className="fas fa-microphone"></i>
                        ) : (
                          <i className="fas fa-stop"></i>
                        )}
                      </div>
                    </div>
                  </div>
                  <ErrorMessage
                    errors={errors}
                    name="userId"
                    as={<span className="text-danger text-xs"></span>}
                  />
                </div>
                {!useCamera && (
                  <div className="mb-3">
                    {/* <label htmlFor="password">Kata Sandi</label> */}
                    <div className="input-group">
                      <input
                        type={passwordShown ? "text" : "password"}
                        className="form-control"
                        placeholder="Kata Sandi"
                        id="password"
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
                          <span
                            className={`${
                              passwordShown ? "fas fa-eye" : "fas fa-eye-slash"
                            }`}
                            onClick={togglePasswordVisiblity}
                          />
                        </div>
                      </div>
                    </div>
                    <ErrorMessage
                      errors={errors}
                      name="password"
                      as={<span className="text-danger text-xs"></span>}
                    />
                  </div>
                )}
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
                {!devMode && !useCamera && (
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
                    type="button"
                    className="btn btn-outline-success btn-block btn-lg"
                    onClick={() => setUseCamera((value) => !value)}
                  >
                    <span className="">
                      {useCamera ? "GUNAKAN KATA SANDI" : "GUNAKAN KAMERA"}
                    </span>
                  </button>
                  <button
                    type="submit"
                    className="btn btn-success btn-block btn-lg"
                    disabled={isLoading}
                  >
                    {isLoading && <i className="fas fa-spinner fa-spin"></i>}
                    MASUK
                  </button>
                  {/* <button className="btn btn-outline-success btn-block btn-lg">
                      <span className="">LUPA KATA SANDI ?</span>
                    </button> */}
                </div>
              </form>
            </div>
            {useCamera && (
              <div className="col-md-6">
                <div>
                  <div className="form-group d-flex mt-2">
                    <label className=""> Sumber Foto : </label>
                    <div className="form-check ml-3">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="radio1"
                        value="camera"
                        checked={imageSource === "camera"}
                        onChange={(e) => setImageSource(e.target.value)}
                      />
                      <label className="form-check-label">Camera</label>
                    </div>
                    <div className="form-check ml-3">
                      <input
                        className="form-check-input"
                        type="radio"
                        value="file"
                        checked={imageSource == "file"}
                        onChange={(e) => setImageSource(e.target.value)}
                      />
                      <label className="form-check-label">File</label>
                    </div>
                  </div>
                </div>
                {imageSource == "camera" && (
                  <div className="">
                    <div className="form-check mt-2">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        id="exampleCheck1"
                        value={flipped}
                        onChange={(e) => setFlipped(e.target.checked)}
                      />
                      <label
                        className="form-check-label"
                        htmlFor="exampleCheck1"
                      >
                        Flip Photo
                      </label>
                    </div>
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
                    {photoURI && !showVideo && imageSource == "camera" && (
                      <img src={photoURI} className="w-100 mt-3"></img>
                    )}
                    <div className="">
                      <button
                        className="btn btn-success mt-2 btn-block"
                        type="button"
                        onClick={showVideo ? takePhoto : startCamera}
                      >
                        {showVideo ? "AMBIL FOTO" : "ULANGI"}
                      </button>
                    </div>
                  </div>
                )}
                {imageSource == "file" && (
                  <div>
                    {photoURI2 && imageSource == "file" && (
                      <img src={photoURI2} className="w-100 mt-3"></img>
                    )}
                    <div className="custom-file mt-3">
                      <input
                        type="file"
                        className="custom-file-input"
                        id="photo"
                        name="photo"
                        accept="image/png, image/jpeg, image/jpg"
                        {...register("photo", {
                          // required: "Pilih file foto terlebih dahulu",
                          onChange: (e) => handleFileInput(e),
                        })}
                      />
                      <label className="custom-file-label" htmlFor="photo">
                        {photo ? photo.name : ""}
                      </label>
                    </div>
                    <ErrorMessage
                      errors={errors}
                      name="photo"
                      as={<span className="text-sm text-danger"></span>}
                    ></ErrorMessage>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
