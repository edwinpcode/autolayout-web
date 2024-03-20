import React, { Suspense, useEffect } from 'react'
import { Navigate, Outlet, useNavigate } from 'react-router-dom'

function PublicRoutes() {
  const hasToken = !!localStorage.getItem('accessToken')
  const navigate = useNavigate()

  useEffect(() => {
    if (hasToken) {
      navigate('/dashboard')
    }
  }, [])

  return (
    <Suspense>
      <Outlet />
    </Suspense>
  )
}

export default PublicRoutes
