import React, { useEffect, useRef, useState } from "react"
import { useMemo } from "react"
import { NumericFormat } from "react-number-format"
import { getChildValueByChildParent } from "../../../Utils/FieldReferenceUtils"
import { handleFieldRule } from "../../../Utils/FieldRuleUtils"
import InputGroup from "../../InputGroup"
import AIService from "Services/AIService"
import ConvertUtil from "Utils/ConvertUtil"

const numericRules = [
  "currencyAbsolute",
  "currency",
  "numericAbsolute",
  "numeric",
]

function InputFormat({
  id,
  fieldItem,
  register,
  watch,
  rule,
  setValue,
  handleOnBlur,
  handleKeyDown,
  defaultValue,
  className,
}) {
  const watchHiddenInput = watch(id, defaultValue)
  return (
    <>
      {fieldItem?.groupInput ? (
        <InputGroup fieldItem={fieldItem}>
          <input type="hidden" id={id} {...register} />
          <NumericFormat
            value={
              watchHiddenInput === ""
                ? ""
                : rule === "numericAbsolute"
                  ? watchHiddenInput
                  : +watchHiddenInput
            }
            type="text"
            allowNegative={
              ["numericAbsolute", "currencyAbsolute"].includes(rule)
                ? false
                : true
            }
            allowLeadingZeros={rule === "numericAbsolute" ? true : false}
            className={"form-control " + className}
            thousandsGroupStyle="thousand"
            thousandSeparator={
              ["numericAbsolute", "numeric"].includes(rule) ? false : ","
            }
            onBlur={handleOnBlur}
            onValueChange={(values) => {
              setValue(id, values.value, { shouldValidate: true })
              const hiddenInput = document.getElementById(id)
              hiddenInput.dispatchEvent(new Event("change"))
            }}
            readOnly={fieldItem?.isReadOnly === "1" || false}
            onKeyDown={handleKeyDown}
          />
        </InputGroup>
      ) : (
        <>
          <input type="hidden" id={id} {...register} />
          <NumericFormat
            value={
              watchHiddenInput === ""
                ? ""
                : rule === "numericAbsolute"
                  ? watchHiddenInput
                  : +watchHiddenInput
            }
            type="text"
            allowNegative={
              ["numericAbsolute", "currencyAbsolute"].includes(rule)
                ? false
                : true
            }
            allowLeadingZeros={rule === "numericAbsolute" ? true : false}
            className={"form-control " + className}
            thousandsGroupStyle="thousand"
            thousandSeparator={
              ["numericAbsolute", "numeric"].includes(rule) ? false : ","
            }
            onBlur={handleOnBlur}
            onValueChange={(values) => {
              setValue(id, values.value, { shouldValidate: true })
              const hiddenInput = document.getElementById(id)
              hiddenInput.dispatchEvent(new Event("change"))
              if (["Persentase", "Nominal Biaya"].includes(fieldItem?.label)) {
                handleOnBlur()
              }
            }}
            readOnly={fieldItem?.isReadOnly === "1" || false}
            onKeyDown={handleKeyDown}
          />
        </>
      )}
    </>
  )
}

const InputTextWithAudio = ({
  fieldItem,
  fieldList,
  panelList,
  label,
  id,
  register,
  control,
  setValue,
  resetField,
  getValues,
  watch,
  hide,
  parent,
  child,
  defaultValue,
  filter,
  showLabel,
  className,
  ...props
}) => {
  const [mediaStreamAudio, setMediaStreamAudio] = useState(null)
  const [mediaRecorder, setMediaRecorder] = useState(null)
  const [recordingStatus, setRecordingStatus] = useState("inactive")
  const [audioUrl, setAudioUrl] = useState(null)
  const [audioBlob, setAudioBlob] = useState(null)
  const [audioChunks, setAudioChunks] = useState([])
  const [isRecording, setIsRecording] = useState(false)
  const debounceTimeoutRef = useRef(null)
  const [border, setBorder] = useState("")

  const fieldRule = useMemo(() => handleFieldRule(fieldItem), [])
  // console.log(fieldItem)
  const handleOnBlur = () => {
    // if has child
    if (child.length) {
      child.forEach((childId) => {
        // console.log('get child')
        getChildValueByChildParent(childId, panelList, getValues, setValue)
      })
    }
  }

  useEffect(() => {
    defaultValue && setValue(id, defaultValue)

    // hide field
    if (fieldItem?.hide === "1") {
      const currentEl = document.getElementById(id)
      if (currentEl) {
        currentEl.parentElement.parentElement.style.display = "none"
      }
    }

    if (parent && parent.length) {
      parent.forEach((parentId) => {
        const parentEl = document.getElementById(parentId)
        if (parentEl) {
          let eventType = parentEl.tagName === "INPUT" ? "input" : "change"
          parentEl.addEventListener(eventType, () => {
            // reset current field value
            resetField(id)
            const currentFieldEl = document.getElementById(id)
            currentFieldEl.dispatchEvent(new Event("change"))
            // reset child value
            if (child.length) {
              child.forEach((childId) => {
                resetField(childId)
                const childEl = document.getElementById(childId)
                childEl.dispatchEvent(new Event("change"))
              })
            }
          })
        }
      })
    }

    if (fieldItem?.isReadOnly === "1") {
      const elementId = document.getElementById(id)
      if (elementId) {
        document.getElementById(id).addEventListener("change", handleOnBlur)
      }
    }
  }, [])

  // handle on type
  const handleKeyDown = (e) => {
    if (fieldItem?.maxLength) {
      const maxLength = Number(fieldItem.maxLength) // set maximum length here
      const allowedKeys = ["Backspace", "Delete", "Tab"]
      const isCtrlA = e.ctrlKey && e.key === "a"
      // all allowed key
      const isAllowed =
        e.target.value.length < maxLength ||
        allowedKeys.includes(e.key) ||
        isCtrlA
      // if not allowed
      if (!isAllowed) {
        e.preventDefault()
      }
    }
  }

  useEffect(() => {
    if (defaultValue) {
      setValue(id, defaultValue)
      // hardcode
      if (id === "VDCD10001_002_029_001") {
        const nomorKtpDebitur = getValues("VDCD10001_001_001")
        setValue(id, nomorKtpDebitur)
      }
    }
  }, [defaultValue])

  const watchNoKtp = watch("PA10001_001_001")
  useEffect(() => {
    if (document.getElementById("PA10001_002_001_001")) {
      setValue("PA10001_002_001_001", watchNoKtp)
    }
  }, [watchNoKtp])

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
      // console.log("stop")
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

  const search = async (audioBlob) => {
    const formData = new FormData()
    const timestamp = new Date().toISOString().replace(/[-:.]/g, "")
    const randomString = Math.random().toString(36).substring(2, 5)
    const fileName = `audio_${timestamp}_${randomString}.webm`
    // console.log(audioBlob)
    formData.append("file", audioBlob, fileName)
    formData.append("removewhitespace", "0")
    try {
      setRecordingStatus("search")
      const res = await AIService.voiceToText(formData)
      if (res.data.status == "1") {
        setValue(fieldItem.id, res.data.message)
      }
      URL.revokeObjectURL(audioUrl)
      setAudioUrl(null)
      setAudioBlob(null)
    } catch (error) {
      // window.Swal.fire("Kesalahan", error.message, "error")
    } finally {
      setRecordingStatus("inactive")
    }
  }

  useEffect(() => {
    if (audioBlob) {
      search(audioBlob)
    }
  }, [audioBlob])

  return (
    <>
      {showLabel && (
        <label onClick={() => console.log(fieldItem)}>
          {fieldItem.label}
          {fieldItem?.isMandatory === "1" && (
            <span className="text-danger font-weight-bold"> *</span>
          )}
        </label>
      )}
      <div className="input-group">
        {numericRules.includes(fieldItem?.rule) ? (
          <InputFormat
            id={id}
            fieldItem={fieldItem}
            rule={fieldItem?.rule}
            register={register(id, fieldRule)}
            watch={watch}
            setValue={setValue}
            handleOnBlur={handleOnBlur}
            handleKeyDown={handleKeyDown}
            defaultValue={defaultValue}
            className={className}
          />
        ) : (
          <>
            {fieldItem?.groupInput ? (
              <InputGroup fieldItem={fieldItem}>
                <input
                  id={id}
                  type="text"
                  className={
                    "form-control form-control-sm " + border + className
                  }
                  defaultValue={defaultValue || ""}
                  {...register(id, fieldRule)}
                  onBlur={handleOnBlur}
                  readOnly={fieldItem?.isReadOnly == "1" || false}
                />
              </InputGroup>
            ) : (
              <>
                {fieldItem?.rule === "alphaonly" ? (
                  <input
                    id={id}
                    type="text"
                    className={
                      "form-control form-control-sm " + border + className
                    }
                    defaultValue={defaultValue || ""}
                    {...register(id, fieldRule)}
                    onBlur={handleOnBlur}
                    onKeyDown={handleKeyDown}
                    readOnly={fieldItem?.isReadOnly == "1" || false}
                  />
                ) : (
                  <input
                    id={id}
                    type="text"
                    className="form-control form-control-sm"
                    defaultValue={defaultValue || ""}
                    {...register(id, fieldRule)}
                    onBlur={handleOnBlur}
                    onKeyDown={handleKeyDown}
                    readOnly={fieldItem?.isReadOnly == "1" || false}
                  />
                )}
              </>
            )}
          </>
        )}
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
    </>
  )
}

export default InputTextWithAudio
