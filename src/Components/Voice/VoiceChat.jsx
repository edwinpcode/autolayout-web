import React, { useEffect, useRef, useState } from "react"
import { useForm } from "react-hook-form"
import AIService from "Services/AIService"
import ConvertUtil from "Utils/ConvertUtil"

const VoiceChat = () => {
  const [recordingStatus, setRecordingStatus] = useState("inactive")
  const [border, setBorder] = useState("")
  const [isRecording, setIsRecording] = useState(false)
  const [mediaStream, setMediaStream] = useState(null)
  const [audioChunks, setAudioChunks] = useState([])
  const [mediaRecorder, setMediaRecorder] = useState(null)
  const debounceTimeoutRef = useRef(null)
  const [audioBlob, setAudioBlob] = useState(null)
  const videoRef = useRef()
  const [audioUrl, setAudioUrl] = useState(null)
  const [message, setMessage] = useState([])
  const mainRef = useRef()
  const audioWelcomeRef = useRef()
  const audioWaitingRef = useRef()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm()

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
      const percentage = ConvertUtil.converttoNewScale(max)
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
        const blob = new Blob(audioChunks, { type: "audio/webm" })
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

  // WIP
  const onSubmit = ({ question }) => {
    // return window.Swal.fire("Informasi", "Currently WIP", "info")
    search({ flag: "message", message: question })
  }

  // WIP
  const search = async ({ audioBlob, flag, message }) => {
    // return window.Swal.fire("Informasi", "Currently WIP", "info")
    const formData = new FormData()
    const timestamp = new Date().toISOString().replace(/[-:.]/g, "")
    const randomString = Math.random().toString(36).substring(2, 5)
    const fileName = `audio_${timestamp}_${randomString}.webm`
    formData.append("flag", flag)
    if (audioBlob) {
      formData.append("file", audioBlob, fileName)
    }
    if (message) {
      formData.append("message", message)
    }
    formData.append("removewhitespace", "0")
    formData.append("type", "virtualassistant")
    setRecordingStatus("searching")
    if (videoRef.current) {
      videoRef.current.play().catch((e) => {
        // console.log("Error: ", e)
      })
    }
    const audio = document.getElementById("waitingVoice")
    if (audio) audio.play()
    const time = setTimeout(async () => {
      try {
        const res = await AIService.speecToTextVA(formData)
        URL.revokeObjectURL(audioUrl)
        setAudioUrl(null)
        setAudioBlob(null)
        if (res.data.status == "1") {
          setMessage((array) => [...array, ...res.data.message])
        }
        setRecordingStatus("inactive")
      } catch (error) {
        // window.Swal.fire("Kesalahan", error.message, "error")
        setMessage((message) => [...message, "Jawaban : Something Went Wrong"])
      } finally {
        setRecordingStatus("inactive")
        reset()
      }
    }, 5000)
    return () => clearTimeout(time)
  }

  const clearData = () => {
    URL.revokeObjectURL(audioUrl)
    setAudioUrl(null)
    setAudioBlob(null)
    setMessage([])
  }

  useEffect(() => {
    if (audioBlob) {
      search({ audioBlob, flag: "voice" })
    }
  }, [audioBlob])

  useEffect(() => {
    const element = mainRef.current

    if (element && !message.length) {
      const observer = new MutationObserver((mutationsList) => {
        mutationsList.forEach((mutation) => {
          if (mutation.attributeName === "class") {
            const currentClassName = element.className
            if (!currentClassName.includes("d-none")) {
              const audio = document.getElementById("welcomeGreeting")
              if (audio) {
                audio.play()
              }
            }
          }
        })
      })

      observer.observe(element, { attributes: true })

      return () => {
        observer.disconnect()
      }
    }
  }, [message])
  return (
    <div
      ref={mainRef}
      className="position-relative"
      style={{
        height: "30vh",
      }}
    >
      <div className="d-flex justify-content-between p-2 border-bottom">
        <div className="d-flex">
          <div
            className="border overflow-hidden"
            style={{ borderRadius: "999px" }}
          >
            <img src="images/icon/vaIcon.jpeg" height={32} width={32} />
          </div>
          <div className="text-lg text-bold ml-2">Pevita</div>
          <audio id="welcomeGreeting" ref={audioWelcomeRef}>
            <source src="audio/welcome.mp4" type="audio/mp4"></source>
          </audio>
          <audio id="waitingVoice" ref={audioWaitingRef}>
            <source src="audio/waiting.mp4" type="audio/mp4"></source>
          </audio>
        </div>
        <div>
          <button className="btn btn-sm btn-secondary" onClick={clearData}>
            <i className="fas fa-trash"></i>
            Clear
          </button>
        </div>
      </div>
      <div className="p-2 overflow-auto">
        {message.map((item, index) => {
          if (item.toLowerCase().includes("jawaban")) {
            const res = item.split(":")
            if (res.length >= 2)
              return (
                <div key={index} className="d-flex mt-2">
                  <div className="text-left border rounded bg-success p-1 mb-1">
                    {res[1]}
                  </div>
                </div>
              )
          } else {
            const res = item.split(":")
            if (res.length >= 2)
              return (
                <div key={index} className="d-flex justify-content-end">
                  <div className="text-right border rounded p-1 mb-1">
                    {res[1]}
                  </div>
                </div>
              )
          }
        })}
      </div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="position-fixed bg-light"
        style={{
          // width: "25%",
          bottom: 0,
        }}
      >
        <div className="input-group">
          <input
            className={`form-control form-control-lg ${border}`}
            placeholder={
              recordingStatus == "searching"
                ? "Loading..."
                : recordingStatus == "recording"
                  ? "Recording..."
                  : "Ketik..."
            }
            {...register("question", {
              required: "Please fill message",
            })}
          ></input>
          <div className={`input-group-append`}>
            <div className="input-group-text">
              <div className="d-flex justify-content-between mr-1">
                <div
                  onClick={
                    recordingStatus == "inactive" ? startRecord : stopRecord
                  }
                  disabled={recordingStatus == "searching"}
                >
                  {recordingStatus == "searching" ? (
                    <i className="fas fa-spinner fa-spin"></i>
                  ) : recordingStatus == "inactive" ? (
                    <i className="fas fa-microphone"></i>
                  ) : (
                    <i className="fas fa-stop"></i>
                  )}
                </div>
              </div>
              {recordingStatus != "searching" && (
                <div onClick={handleSubmit(onSubmit)}>
                  <i className="fas fa-paper-plane"></i>
                </div>
              )}
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}

export default VoiceChat
