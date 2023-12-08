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
import {
  loadCaptchaEnginge,
  LoadCanvasTemplate,
  LoadCanvasTemplateNoReload,
  validateCaptcha,
} from 'react-simple-captcha'

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

  const handleLogin = ({ userId, password, captcha }) => {
    if (!validateCaptcha(captcha)) {
      return window.Swal.fire('Error', 'Wrong captcha', 'error')
    }
    setLoading(true)
    const secret = getSecretKeyByDate()
    const encrypted = encryptAES(password, secret)
    AuthLogin(userId, encrypted)
      .then((res) => {
        if (res.response.status == 1) {
          localStorage.setItem('accessToken', res.response.accessToken)
          localStorage.setItem('refreshToken', res.response.refreshToken)
          localStorage.setItem('expiredIn', res.response.expiredIn)
          localStorage.setItem('userId', res.response.userId)
          window.location = '/auth'
          dispatch(setUserId(res.response.userId))
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

  useEffect(() => {
    loadCaptchaEnginge(6)
  }, [])

  const handleFailure = () => {
    window.Swal.fire('Error', 'Wrong Captcha', 'error')
  }

  const handleSuccess = () => {
    window.Swal.fire('Success', '', 'success')
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
              <LoadCanvasTemplate />
              <div className="mb-3">
                <div className="form-group">
                  <input
                    type="text"
                    className="form-control"
                    id="captcha"
                    {...register('captcha', {
                      required: 'Captcha Required',
                    })}
                    autoComplete="off"
                  />
                </div>
                <ErrorMessage
                  errors={errors}
                  name="captcha"
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
