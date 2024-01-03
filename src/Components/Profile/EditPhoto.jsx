import { ErrorMessage } from "@hookform/error-message"
import { useRef, useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { useDispatch, useSelector } from "react-redux"
import { axiosPost } from "../../Services/AutoLayoutService"
import { setLoadingSpin } from "../../Store/Loading/LoadingSlice"
import { updatePhoto } from "../../Services/UserService"
import BlobUtil from "../../Utils/BlobUtil"

function EditPhoto() {
  const dispatch = useDispatch()
  const fileInputRef = useRef(null)
  const [selectedFile, setSelectedFile] = useState(null)
  // prettier-ignore
  const { register, handleSubmit, setValue, watch, formState: { errors }, reset } = useForm()
  const { photo } = watch()
  // redux
  const userId = useSelector((state) => state.user.id)
  const [loading, setLoading] = useState(false)

  const handleFileInput = (e) => {
    // console.log(e.target.files)
    const file = e.target.files[0]
    setSelectedFile(URL.createObjectURL(file))
  }

  const canvasCameraRef = useRef()
  const videoRef = useRef(null)
  const [photoURI, setPhotoURI] = useState(null)
  const [showVideo, setShowVideo] = useState(false)
  const [mediaStreamVideo, setMediaStreamVideo] = useState(null)
  const [useCamera, setUseCamera] = useState(true)
  const [flipped, setFlipped] = useState(false)
  const [imageSource, setImageSource] = useState("camera")

  useEffect(() => {
    console.log(photo)
  }, [photo])

  const resetForm = () => {
    if (photoURI) {
      URL.revokeObjectURL(photoURI)
      setPhotoURI(null)
    }
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
      if (photoURI) {
        URL.revokeObjectURL(photoURI)
        setPhotoURI(null)
      }
    }
  }, [useCamera, mediaStreamVideo, photoURI])

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true })
      setPhotoURI(null)
      setShowVideo(true)
      if (videoRef.current) {
        setMediaStreamVideo(stream)
        videoRef.current.srcObject = stream
        videoRef.current.style.transform = "scaleX(-1)"
        setFlipped(true)
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
      setValue("photoURI", photoData)
      if (mediaStreamVideo) {
        setShowVideo(false)
        mediaStreamVideo.getTracks().forEach((track) => track.stop())
        setMediaStreamVideo(null)
      }
    }
  }

  useEffect(() => {
    if (imageSource == "file") {
      setShowVideo(false)
      if (mediaStreamVideo) {
        mediaStreamVideo.getTracks().forEach((track) => track.stop())
        setMediaStreamVideo(null)
      }
    }
  }, [imageSource])

  useEffect(() => {
    if (useCamera) {
      startCamera()
    }
  }, [useCamera])

  const handleUpdatePhoto = ({ photoURI, photo }) => {
    dispatch(setLoadingSpin(true))

    const formData = new FormData()
    formData.append("userid", userId)
    formData.append("uploadtype", "profile")
    if (!photoURI && imageSource == "camera") {
      return window.Swal.fire("Peringatan", "Silahkan Ambil Foto", "warning")
    }
    console.log(photo.length)
    if (!photo.length && imageSource == "file") {
      return window.Swal.fire("Peringatan", "Silahkan Pilih Foto", "warning")
    }
    if (imageSource == "camera") {
      const timestamp = new Date().toISOString().replace(/[-:.]/g, "")
      const randomString = Math.random().toString(36).substring(2, 5)
      const blob = BlobUtil.base64toBlob(photoURI)
      const fileName = `photo_${timestamp}_${randomString}.png`
      formData.append("file", blob, fileName)
    } else {
      formData.append("file", photo[0])
    }
    setLoading(true)
    updatePhoto(formData)
      .then((res) => {
        if (res.data.status != "1") {
          dispatch(setLoadingSpin(false))
          return window.Swal.fire("Kesalahan", res.data.message, "error")
        }
        reset()
        dispatch(setLoadingSpin(false))
        return window.Swal.fire("Berhasil", res.data.message, "success")
      })
      .catch((e) => {
        window.Swal.fire("Error", e.message, "error")
      })
      .finally(() => {
        setLoading(false)
      })
  }

  return (
    <form
      className="card w-100 card-success"
      id="editProfile"
      onSubmit={handleSubmit(handleUpdatePhoto)}
    >
      <div className="card-header">
        <h3 className="card-title">Edit Profil</h3>
        <div className="card-tools m-0">
          <button
            type="button"
            className="btn btn-tool"
            data-card-widget="collapse"
          >
            <i className="fas fa-minus"></i>
          </button>
        </div>
      </div>
      <div className="card-body">
        <div className="row">
          <div className="d-flex">
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
          {imageSource == "file" && (
            <div className="col-md-12">
              <div className="text-center">
                <label htmlFor="photo">
                  <img
                    src={
                      selectedFile
                        ? selectedFile
                        : "https://via.placeholder.com/150"
                    }
                    alt="Preview Foto"
                    className="img-thumbnail img-circle mb-3"
                    style={{ height: 145, width: 145, objectFit: "cover" }}
                  />
                </label>
                <div className="custom-file">
                  <input
                    type="file"
                    className="custom-file-input"
                    id="photo"
                    name="photo"
                    disabled={loading}
                    accept="image/png, image/jpeg, image/jpg"
                    {...register("photo", {
                      // required: "Pilih file foto terlebih dahulu",
                      onChange: (e) => handleFileInput(e),
                    })}
                  />
                  <label className="custom-file-label" htmlFor="photo">
                    {photo && photo.length ? photo[0].name : "Pilih File"}
                  </label>
                </div>
                <small className="text-muted">
                  Upload foto dengan format .jpg, .jpeg, atau .png
                </small>
              </div>
              <ErrorMessage
                errors={errors}
                name="photo"
                as="div"
                style={{ color: "red", marginTop: "5px" }}
              />
            </div>
          )}

          {imageSource == "camera" && (
            <div className="col-md-12">
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
                  disabled={loading}
                >
                  {showVideo ? "AMBIL FOTO" : "ULANGI"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="card-footer">
        <button
          className="btn btn-sm btn-success"
          type="submit"
          disabled={loading}
        >
          {loading && <i className="fas fa-spinner fa-spin"></i>}
          Simpan
        </button>
      </div>
    </form>
  )
}

export default EditPhoto
