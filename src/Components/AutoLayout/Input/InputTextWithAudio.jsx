import React, { useEffect, useRef, useState } from "react"
import FullLoad from "../../../Pages/FullLoad"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import {
  getDataActionWithButton,
  getDataActionWithFormData,
} from "../../../Services/AutoLayoutService"
import { setFormAction, setFormPanel } from "../../../Store/Form/FormSlice"
import { resetDropdown, setDropdown } from "../../../Store/Input/DropdownSlice"
import {
  setLoadingField,
  setLoadingSpin,
} from "../../../Store/Loading/LoadingSlice"
import InputCommon from "./InputCommon"
import { useForm } from "react-hook-form"
import { ErrorMessage } from "@hookform/error-message"
import ConvertUtil from "Utils/ConvertUtil"

const InputTextWithAudio = ({
  button = [],
  child,
  defaultValue,
  flag,
  fieldItem,
  fieldList,
  isMandatory,
  label,
  panel,
  parent,
  path,
  width,
  ...props
}) => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  // prettier-ignore
  const { register, handleSubmit, formState: { errors }, getValues, setValue, resetField, watch, clearErrors, } = useForm()
  // redux
  const userId = useSelector((state) => state.user.id)
  const menu = useSelector((state) => state.menu)

  // audio
  const [mediaStreamAudio, setMediaStreamAudio] = useState(null)
  const [mediaRecorder, setMediaRecorder] = useState(null)
  const [recordingStatus, setRecordingStatus] = useState("inactive")
  const [audioUrl, setAudioUrl] = useState(null)
  const [audioChunks, setAudioChunks] = useState([])
  const [isRecording, setIsRecording] = useState(false)
  const [border, setBorder] = useState("")
  const debounceTimeoutRef = useRef(null)
  const [audioBlob, setAudioBlob] = useState(null)

  useEffect(() => {
    if (!mediaStreamAudio) return
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)()
    const analyser = audioCtx.createAnalyser()
    const source = audioCtx.createMediaStreamSource(mediaStreamAudio)
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

  const startRecord = () => {
    navigator.mediaDevices
      .getUserMedia({
        audio: true,
      })
      .then(async (stream) => {
        setIsRecording(true)
        setMediaStreamAudio(stream)
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
      console.log("stop")
      setIsRecording(false)
      mediaRecorder.stop()
      setRecordingStatus("inactive")
      mediaRecorder.onstop = async () => {
        clearTimeout(debounceTimeoutRef.current)
        debounceTimeoutRef.current = null
        const blob = new Blob(audioChunks, { type: "audio/webm" })
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

  const search = (audioBlob) => {
    dispatch(setFormPanel([]))
    dispatch(setFormAction([]))
    dispatch(setLoadingField(true))
    dispatch(setLoadingSpin(true))
    if (button.length) {
      const param = [{ id: fieldItem.id, value: getValues(fieldItem.id) }]
      const formData = new FormData()
      const timestamp = new Date().toISOString().replace(/[-:.]/g, "")
      const randomString = Math.random().toString(36).substring(2, 5)
      const fileName = `audio_${timestamp}_${randomString}.webm`
      formData.append("file", audioBlob, fileName)
      formData.append("removewhitespace", "0")
      formData.append("type", button[0].id)
      formData.append("tabId", menu.activeTabId)
      formData.append("tc", menu.activeTrackId)
      formData.append("userId", userId)
      formData.append("param", param)
      // for (var pair of formData.entries()) {
      //   console.log(pair[0] + ", " + pair[1])
      // }
      getDataActionWithFormData({
        path: button[0].path,
        formData,
      })
        .then((res) => {
          dispatch(setLoadingSpin(false))
          dispatch(setLoadingField(false))
          // nik baru (tidak ditemukan)
          if (res.data.status == "0") {
            // navigate(`/${menuId}/${id}/${value}`, { state: { param: [] } })
            // navigate("/", { state: { param: [] } })
            dispatch(setFormPanel(res.data.panel))
            dispatch(setFormAction(res.data.action))
            return window.Swal.fire("", res.data.message, "warning")
          }
          // nik ditemukan
          if (res.data.status == "1") {
            dispatch(setFormPanel(res.data.panel))
            dispatch(setFormAction(res.data.action))
            return window.Swal.fire("", res.data.message, "success")
          }
          // nik dalam pengajuan
          if (res.data.status == "2") {
            // navigate(`/${menuId}`)
            navigate("/")
            return window.Swal.fire("", res.data.message, "warning")
          }
        })
        .catch((error) => {
          window.Swal.fire("Kesalahan", error.message, "error")
        })
    }
  }

  useEffect(() => {
    if (audioBlob) {
      search(audioBlob)
    }
  }, [audioBlob])

  return (
    <>
      <label className={`${fieldItem.hide ? "hidden" : ""}`}>
        {label}
        {isMandatory && (
          <span className="text-danger font-weight-bold"> *</span>
        )}
      </label>
      <div className="input-group">
        <InputCommon
          showLabel={false}
          fieldItem={fieldItem}
          fieldList={fieldList}
          panelList={panel}
          id={fieldItem.id}
          parent={[]}
          child={[]}
          defaultValue={fieldItem.value}
          getValues={getValues}
          setValue={setValue}
          watch={watch}
          resetField={resetField}
          hide={fieldItem.hide == "1" || false}
          register={register}
          className={border}
        />
        <div
          className="input-group-append"
          onClick={recordingStatus == "inactive" ? startRecord : stopRecord}
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
        name={fieldItem.id}
        as="div"
        style={{ color: "red", marginTop: "5px" }}
      />
    </>
  )
}

export default InputTextWithAudio
