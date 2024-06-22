import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { NavLink, Link, useNavigate } from 'react-router-dom'
import { setMenuSlice } from '../Store/Menu/menuSlice'
import { AuthLogout } from '../Services/AuthService'
import Load from '../Pages/FullLoad'

function Header() {
  const dispatch = useDispatch()
  // redux state
  const userState = useSelector((state) => state.user)
  const userData = userState.data
  const userId = useSelector((state) => state.user.id)
  const activeModuleId = useSelector((state) => state.user.activeModule.id)
  const activeRoleId = useSelector((state) => state.user.activeRole.id)

  // loading
  const [loader, showLoader, hideLoader] = Load()

  let navigate = useNavigate()

  const handleLogout = () => {
    showLoader()
    AuthLogout(userId, activeModuleId, activeRoleId).then((res) => {
      if (res.data.response.status != '1') {
        hideLoader()
        return window.Swal.fire('Kesalahan', res.data.message, 'error')
      }
      hideLoader()
      localStorage.clear()
      window.location.replace('/login')
    })
  }

  return (
    <>
      <nav className="main-header navbar navbar-expand navbar-white navbar-light text-sm">
        {/* Left navbar links */}
        <ul className="navbar-nav">
          <li className="nav-item">
            <a
              className="nav-link"
              data-widget="pushmenu"
              href="#"
              role="button"
            >
              <i className="fas fa-bars"></i>
            </a>
          </li>
          <li className="nav-item">
            <Link
              className="nav-link"
              onClick={(e) => {
                e.preventDefault()
                dispatch(
                  setMenuSlice({ menuId: null, trackId: null, menuDesc: null })
                )
                navigate('/dashboard')
              }}
            >
              Dashboard
            </Link>
          </li>
        </ul>

        {/* Right navbar links */}
        <ul className="navbar-nav ml-auto">
          <li className="nav-item dropdown">
            <a
              className="nav-link"
              href="#"
              data-toggle="dropdown"
              aria-expanded="true"
            >
              <i className="fas fa-th"></i>
            </a>
            <div className="dropdown-menu dropdown-menu-right">
              {userData?.data?.module.map((data, index) => (
                <div key={index}>
                  {data.id === userState.activeModule.id && (
                    <button
                      data-toggle="modal"
                      data-target="#authStepperModal"
                      className="dropdown-item active d-flex align-items-center justify-content-between"
                    >
                      <div className="d-flex align-items-center">
                        <i className={`${data.icon} mr-2`}></i>
                        <div
                          className="text-truncate"
                          style={{ maxWidth: 150 }}
                        >
                          {userState.activeModule.desc}
                        </div>
                      </div>
                      <span className="badge badge-danger text-xs">
                        {data.totalTaskList}
                      </span>
                    </button>
                  )}
                  {data.id !== userState.activeModule.id && (
                    <>
                      <div className="dropdown-divider"></div>
                      <button
                        data-toggle="modal"
                        data-target="#authStepperModal"
                        className="dropdown-item d-flex align-items-center justify-content-between"
                      >
                        <div className="d-flex align-items-center">
                          <i className={`${data.icon} mr-2`}></i>
                          <div
                            className="text-truncate"
                            style={{ maxWidth: 150 }}
                          >
                            {data.name}
                          </div>
                        </div>
                        <span className="badge badge-danger text-xs">
                          {data.totalTaskList}
                        </span>
                      </button>
                    </>
                  )}
                </div>
              ))}
            </div>
          </li>
          {/* Notifications Dropdown Menu */}
          <li className="nav-item dropdown">
            <a className="nav-link" href="#" data-toggle="dropdown">
              <img
                src="/images/user2-160x160.jpg"
                className="img-circle"
                style={{ height: 35, position: 'relative', top: '-7px' }}
                alt="User..."
              />
            </a>
            <div className="dropdown-menu dropdown-menu-lg dropdown-menu-right">
              <div className="p-3">
                <div className="row">
                  <div className="col-3 font-weight-bold">User</div>
                  <div className="col-9">{userData?.fullname}</div>
                </div>

                <div className="row">
                  <div className="col-3 font-weight-bold">Role</div>
                  <div className="col-9">{userState.activeRole.desc}</div>
                </div>

                <div className="row">
                  <div className="col-3 font-weight-bold">Branch</div>
                  <div className="col-9">{userData?.branchName}</div>
                </div>
              </div>

              <div className="dropdown-divider"></div>
              <NavLink to="/profile" className="dropdown-item">
                <i className="fas fa-user mr-2"></i> Profile
              </NavLink>
              <div className="dropdown-divider"></div>
              <a
                href="#"
                onClick={() => handleLogout()}
                className="dropdown-item"
              >
                <i className="fas fa-sign-out-alt mr-2"></i> Logout
              </a>
            </div>
          </li>
        </ul>
      </nav>
      {loader}
    </>
  )
}

export default Header
