import React, { useState } from "react"
import { useForm } from "react-hook-form"
import { useSelector } from "react-redux"
import AIService from "../../Services/AIService"

const FaceRecognition = () => {
  const [loading, setLoading] = useState(false)
  const [selectedFile, setSelectedFile] = useState(null)
  const { register, setValue, handleSubmit } = useForm()
  const useId = useSelector((state) => state.user.id)

  const handleFileInput = (e) => {
    // console.log(e.target.files)
    const file = e.target.files[0]
    setSelectedFile(URL.createObjectURL(file))
  }

  const onSubmit = async ({ filename, photo }) => {
    try {
      const formData = new FormData()
      formData.append("id", useId)
      formData.append("filename", filename)
      formData.append("image", photo[0])
      setLoading(true)
      const res = await AIService.faceRegister(formData)
      console.log(res)
    } catch (e) {
      window.Swal.fire("Error", e.message, "error")
    } finally {
      setLoading(false)
    }
  }
  return (
    <div className="card card-success">
      <div className="card-header">
        <span>Face Recognition</span>
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
        <form onSubmit={handleSubmit(onSubmit)}>
          <label htmlFor="filename">File Name</label>
          <div className="input-group">
            <input
              id="filename"
              className="form-control"
              {...register("filename", {
                required: "Name Required",
              })}
            />
          </div>
          <div className="text-center mt-3">
            <label htmlFor="photo">
              <img
                src={selectedFile || "https://via.placeholder.com/150"}
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
                accept="image/png, image/jpeg, image/jpg"
                {...register("photo", {
                  required: "Pilih file foto terlebih dahulu",
                  onChange: (e) => handleFileInput(e),
                })}
              />
              <label className="custom-file-label" htmlFor="photo">
                Pilih file
              </label>
            </div>
            <small className="text-muted">
              Upload foto dengan format .jpg, .jpeg, atau .png
            </small>
          </div>
          <div className="d-flex">
            <button
              type="submit"
              className="btn btn-success btn-sm"
              disabled={loading}
            >
              {loading && <i className="fas fa-spinner fa-spin"></i>}
              Simpan
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default FaceRecognition
