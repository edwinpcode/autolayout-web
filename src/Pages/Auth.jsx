import React, { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import AuthStepperContent from "../Components/Stepper/AuthStepperContent"
import { useSelector } from "react-redux"
import { AuthLogout } from "../Services/AuthService"
import Load from "../Pages/FullLoad"
import Logo from "./Logo"

function Auth() {
  const navigate = useNavigate()
  // redux state
  const userId = useSelector((state) => state.user.id)
  const activeModuleId = useSelector((state) => state.user.activeModule.id)
  const activeRoleId = useSelector((state) => state.user.activeRole.id)
  // loading
  const [loader, showLoader, hideLoader] = Load()

  const handleLogout = () => {
    showLoader()
    AuthLogout({
      userId,
      moduleId: activeModuleId,
      groupId: activeRoleId,
    })
      .then((response) => {
        if (response.data.response.status == "1") {
          // window.Swal.fire('Error', response.data.response.msg, 'error')
          localStorage.clear()
          navigate("/login")
          hideLoader()
        }
      })
      .catch((e) => {
        window.Swal.fire("Error", "Something went wrong", "error")
      })
      .finally(() => hideLoader())
  }

  return (
    <>
      <div
        style={{ backgroundColor: "#e9ecef" }}
        className="vh-100 d-flex justify-content-center align-items-center"
      >
        <div className="card w-75">
          <div style={{ width: 250, margin: "30px auto" }}>
            <Logo />
          </div>
          <div className="card-body">
            <AuthStepperContent />
          </div>
          <div className="card-footer d-flex justify-content-center">
            <button
              type="button"
              onClick={() => handleLogout()}
              className="btn btn-link text-danger font-weight-bold"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
      {loader}
    </>
  )
}

export default Auth
