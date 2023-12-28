import { ErrorMessage } from "@hookform/error-message"
import { useRef, useState } from "react"
import { useForm } from "react-hook-form"
import { useDispatch, useSelector } from "react-redux"
import { axiosPost } from "../../Services/AutoLayoutService"
import { setLoadingSpin } from "../../Store/Loading/LoadingSlice"
import { updatePhoto } from "../../Services/UserService"

function EditPhoto() {
  const dispatch = useDispatch()
  const fileInputRef = useRef(null)
  const [selectedFile, setSelectedFile] = useState(null)
  // prettier-ignore
  const { register, handleSubmit, formState: { errors }, reset } = useForm()
  // redux
  const userId = useSelector((state) => state.user.id)
  const [loading, setLoading] = useState(false)

  const handleFileInput = (e) => {
    // console.log(e.target.files)
    const file = e.target.files[0]
    setSelectedFile(URL.createObjectURL(file))
  }

  const handleUpdatePhoto = (data) => {
    dispatch(setLoadingSpin(true))

    const formData = new FormData()
    formData.append("userid", userId)
    formData.append("uploadtype", "profile")
    formData.append("file", data.photo[0])
    setLoading(true)
    updatePhoto(formData)
      .then((res) => {
        if (res.data.status != "1") {
          dispatch(setLoadingSpin(false))
          return window.Swal.fire("", res.data.message, "error")
        }
        reset()
        dispatch(setLoadingSpin(false))
        return window.Swal.fire("", res.data.message, "success")
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
      className="card w-100 card-danger"
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
          <div className="col-md-12">
            <div className="text-center">
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
            <ErrorMessage
              errors={errors}
              name="photo"
              as="div"
              style={{ color: "red", marginTop: "5px" }}
            />
          </div>
        </div>
      </div>
      <div className="card-footer">
        <button
          className="btn btn-sm btn-danger"
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
