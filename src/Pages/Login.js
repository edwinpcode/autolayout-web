import { ErrorMessage } from '@hookform/error-message'
import moment from 'moment'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { AuthLogin } from '../Services/AuthService'
import { encryptAES } from '../Utils/EncryptUtils'
import Logo from './Logo'
import { useDispatch } from 'react-redux'
import { setUser, setUserId } from '../Store/User/userSlice'

const metaTags = document.getElementsByTagName('meta')
const metaTagsArray = Array.from(metaTags)

const applicationNameTag = metaTagsArray.find((tag) => {
  return tag.getAttribute('name') === 'login-application-name'
})

const loginApplicationName = applicationNameTag.getAttribute('content')

function Login() {
  // load login
  const [isLoading, setLoading] = useState(false)
  // show hide password
  const [passwordShown, setPasswordShown] = useState(false)
  const togglePasswordVisiblity = () => {
    setPasswordShown(passwordShown ? false : true)
  }

  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ mode: 'onChange' })

  const dispatch = useDispatch()

  const getSecretKeyByDate = () => {
    const currentDate = moment().locale('en')
    const formattedDate = currentDate.format('dddYYYYMMDD')
    return formattedDate + '00000'
  }

  const handleLogin = ({ userId, password }) => {
    setLoading(true)
    const secret = getSecretKeyByDate()
    const encrypted = encryptAES(password, secret)
    AuthLogin(userId, encrypted)
      .then((res) => {
        if (res.response.status == 1) {
          localStorage.setItem('token', res.response.accessToken)
          localStorage.setItem('branchId', res.response.branchId)
          localStorage.setItem('branchName', res.response.branchName)
          localStorage.setItem('expiredIn', res.response.expiredIn)
          localStorage.setItem('fullname', res.response.fullname)
          localStorage.setItem('photoProfile', res.response.photoProfile)
          localStorage.setItem('userId', res.response.userId)
          localStorage.setItem('tokenType', res.response.tokenType)
          window.location = '/auth'
          dispatch(setUserId(res.response.userId))
          // navigate('/auth')
        } else {
          setLoading(false)
          window.Swal.fire('Kesalahan', res.response.message, 'error')
        }
      })
      .catch((err) => {
        setLoading(false)
        window.Swal.fire(
          'Peringatan',
          'Mohon maaf, sedang terjadi kendala koneksi pada sistem, silahkan coba kembali secara berkala',
          'error'
        )
      })
  }

  return (
    <div className="login-page">
      <div className="login-box">
        <div className="card">
          <div className="card-body login-card-body rounded">
            <div className="login-logo">
              <Logo />
              <hr></hr>
              <a href="#">
                <b>{loginApplicationName}</b>
              </a>
            </div>
            <p className="login-box-msg">
              Silakan masuk untuk memulai aplikasi.
            </p>
            <form onSubmit={handleSubmit(handleLogin)}>
              <div className="mb-3">
                <div className="input-group">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Nama Pengguna"
                    {...register('userId', {
                      required: 'User ID required',
                    })}
                    autoComplete="off"
                  />
                  <div className="input-group-append">
                    <div className="input-group-text">
                      <span className="fas fa-user" />
                    </div>
                  </div>
                </div>
                <ErrorMessage
                  errors={errors}
                  name="userId"
                  as={<span className="text-danger text-xs"></span>}
                />
              </div>
              <div className="mb-3">
                <div className="input-group">
                  <input
                    type={passwordShown ? 'text' : 'password'}
                    className="form-control"
                    placeholder="Kata Sandi"
                    {...register('password', {
                      required: 'Password required',
                    })}
                  />
                  <div className="input-group-append">
                    <div className="input-group-text">
                      {!passwordShown && (
                        <span
                          className="fas fa-lock"
                          onClick={togglePasswordVisiblity}
                        />
                      )}{' '}
                      {passwordShown && (
                        <span
                          className="fas fa-unlock"
                          onClick={togglePasswordVisiblity}
                        />
                      )}{' '}
                    </div>
                  </div>
                </div>
                <ErrorMessage
                  errors={errors}
                  name="password"
                  as={<span className="text-danger text-xs"></span>}
                />
              </div>
              <div className="row float-right">
                <div className="col-12 float-end">
                  {!isLoading && (
                    <button type="submit" className="btn btn-danger btn-block">
                      Masuk
                    </button>
                  )}
                  {isLoading && (
                    <button
                      type="submit"
                      disabled
                      className="btn btn-danger btn-block"
                    >
                      <i className="fas fa-spinner fa-spin"></i>
                      Masuk
                    </button>
                  )}
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
