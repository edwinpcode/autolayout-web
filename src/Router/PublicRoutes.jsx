import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'

function PublicRoutes() {
  const hasToken = !!localStorage.getItem('accessToken')
  if (hasToken) {
    return <Navigate to="/" />
  } else {
    return <Outlet />
  }
}

export default PublicRoutes
