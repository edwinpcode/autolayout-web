import React, { lazy } from 'react'
import { Route, Routes, BrowserRouter } from 'react-router-dom'
import Home from './Pages/Home'
// import Login from './Pages/Login'
// import AutoLayout from './Pages/AutoLayout'
// import Auth from './Pages/Auth'
import ProtectedRoutes from './Router/ProctectedRoutes'
// import Profile from './Pages/Profile'
// import Dashboard from './Pages/Dashboard'
// import Report from './Pages/Report'
// import TableList from './Pages/TableList'
import PublicRoutes from './Router/PublicRoutes'

const Auth = lazy(() => import('./Pages/Auth'))
const Login = lazy(() => import('./Pages/Login'))
const Report = lazy(() => import('./Pages/Report'))
const AutoLayout = lazy(() => import('./Pages/AutoLayout'))
const TableList = lazy(() => import('./Pages/TableList'))
const Dashboard = lazy(() => import('./Pages/Dashboard'))
const Profile = lazy(() => import('./Pages/Profile'))

const AppRouter = () => {
  return (
    <Routes history={BrowserRouter}>
      <Route element={<ProtectedRoutes />}>
        {/* <Route path="/form-builder" element={<Dnd />} /> */}
        {/* <Route path="/tester" element={<Tester />} /> */}
        <Route path="/auth" element={<Auth />} />
        {/* <Route path="/preview" element={<PreviewDocument />} /> */}
        <Route element={<Home />}>
          <Route path="/" element={<TableList />} />
          <Route path="/form" element={<AutoLayout />} />
          {/* <Route path="/chart" element={<Chart />} /> */}
          <Route path="/profile" element={<Profile />} />
          <Route path="/dashboard" element={<Dashboard />} />
          {/* <Route path="/flowchart" element={<Flowchart />} /> */}
          {/* <Route path="/flowchart/:id" element={<Flowchart />} /> */}
          <Route path="/report" element={<Report />} />
        </Route>
      </Route>
      <Route element={<PublicRoutes />}>
        <Route path="/login" element={<Login />} />
      </Route>
      {/* <Route path="/realdashboard" element={<RealDashboard />} /> */}
      {/* <Route path="/chart-new" element={<NewChart />} /> */}
    </Routes>
  )
}

export default AppRouter
