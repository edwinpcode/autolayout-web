import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Navigate, Outlet, redirect } from 'react-router-dom'
import FullLoad from '../Pages/FullLoad'
import { AuthLogout } from '../Services/AuthService'
import { GetUserById } from '../Services/UserService'
import { setUser, setUserData } from '../Store/User/userSlice'

const sessionTime = 60000 * parseInt(process.env.REACT_APP_SESSION_TIME)

function ProtectedRoutes() {
  const dispatch = useDispatch()
  const hasToken = !!localStorage.getItem('accessToken')
  const [loader, showLoader, hideLoader] = FullLoad()
  // redux
  const user = useSelector((state) => state.user)

  const getUser = async () => {
    await GetUserById(user.id)
      .then((res) => {
        // handle user not found
        if (res.data.status != '1') {
          localStorage.clear()
          return redirect('/login')
        }
        // set current user to redux
        const userId = user.id
        const moduleId = res.data.activeModule.id
        const moduleDesc = res.data.activeModule.desc
        const roleId = res.data.activeRole.id
        const roleDesc = res.data.activeRole.desc
        // set current user to redux
        dispatch(
          setUser({
            userId,
            activeModule: { id: moduleId, desc: moduleDesc },
            activeRole: { id: roleId, desc: roleDesc },
          })
        )
        dispatch(setUserData(res.data))
      })
      .catch((e) => {
        const token = e.response.data?.refreshToken
        if (token) {
          localStorage.setItem('accessToken', e.response.data.refreshToken)
          window.location.reload()
        } else {
          localStorage.clear()
          window.location = '/login'
        }
      })
  }

  const inactivityTime = function () {
    // Set a timer variable to store the timeout ID
    let timer
    // Attach a click event listener to the document
    document.addEventListener('click', () => {
      // If there's a timer running, clear it
      if (timer) {
        clearTimeout(timer)
      }
      // Set a new timer to check for inactivity after 10 seconds
      timer = setTimeout(() => {
        let timerInterval
        // Perform action if the user has been inactive
        window.Swal.fire({
          title: 'Apakah ingin melanjutkan?',
          html: 'keluar otomatis dalam <strong></strong> detik',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          cancelButtonText: 'Keluar',
          confirmButtonText: 'Lanjut!',
          timer: 60000 * 5, // timer konfirmasi
          timerProgressBar: true, // adds a progress bar to the timer
          allowOutsideClick: false,
          allowEscapeKey: false,
          allowEnterKey: false,
          didOpen: () => {
            timerInterval = setInterval(() => {
              window.Swal.getHtmlContainer().querySelector(
                'strong'
              ).textContent = (window.Swal.getTimerLeft() / 1000).toFixed(0)
            }, 100)
          },
          willClose: () => {
            clearInterval(timerInterval)
          },
        }).then((result) => {
          if (result.isConfirmed) {
            document.body.click()
          } else {
            showLoader()
            AuthLogout(user.id, user.activeModule.id, user.activeRole.id).then(
              (res) => {
                if (res.data.response.status != '1') {
                  return window.Swal.fire('', res.data.response.msg, 'error')
                }
                localStorage.clear()
                window.location = '/login'
              }
            )
          }
        })
      }, sessionTime)
    })
  }

  useEffect(() => {
    // get current user by userId
    if (user.activeModule.id === '' || user.activeRole.id === '') {
      getUser()
    } else {
      inactivityTime()
      document.body.click()
    }
  }, [user.activeModule.id, user.activeRole.id])

  return (
    <React.Fragment>
      {hasToken ? <Outlet /> : <Navigate replace to="/login" />}
      {loader}
    </React.Fragment>
  )
}

export default ProtectedRoutes
