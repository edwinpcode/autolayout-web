import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import AuthStepperContent from '../Components/Stepper/AuthStepperContent'
import { useSelector } from 'react-redux'
import { AuthLogout } from '../Services/AuthService'
import Load from '../Pages/FullLoad'
import Logo from './Logo'

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
    AuthLogout(userId, activeModuleId, activeRoleId).then((response) => {
      if (response.data.response.status == '1') {
        // window.Swal.fire('Error', response.data.response.msg, 'error')
        localStorage.clear('token')
        navigate('/login')
        hideLoader()
      }
    })
  }

  return (
    <>
      <div
        style={{ backgroundColor: '#e9ecef' }}
        className="vh-100 d-flex justify-content-center align-items-center"
      >
        <div className="card w-100" style={{ maxWidth: 600 }}>
          <div style={{ width: 250, margin: '30px auto' }}>
            <Logo />
          </div>
          <div className="card-body">
            <AuthStepperContent isAutoSelectModule={true} />
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
