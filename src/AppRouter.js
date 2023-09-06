import React from 'react'
import { Route, Routes, BrowserRouter } from 'react-router-dom'
import Home from './Pages/Home'
import Login from './Pages/Login'
import AutoLayout from './Pages/AutoLayout'
import Auth from './Pages/Auth'
import ProtectedRoutes from './Router/ProctectedRoutes'
import Profile from './Pages/Profile'
import Chart from './Components/Chart/Chart'
import Flowchart from './Pages/Flowchart'
import NewChart from './Components/Chart/NewChart'
import Dashboard from './Pages/Dashboard'
import RealDashboard from './Pages/RealDashboard'
import Report from './Pages/Report'
import Tester from './Pages/Tester'
import TableList from './Pages/TableList'
import InputTextareaWithCheckbox from './Components/AutoLayout/Input/InputTextareaWithCheckbox'
import PreviewDocument from './Pages/PreviewDocument'
import PublicRoutes from './Router/PublicRoutes'
// import { Dnd } from './Components/DnD'
// import Chart from './Pages/Chart'

const AppRouter = () => {
  return (
    <Routes history={BrowserRouter}>
      <Route element={<ProtectedRoutes />}>
        {/* <Route path="/form-builder" element={<Dnd />} /> */}
        <Route path="/tester" element={<Tester />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/preview" element={<PreviewDocument />} />
        <Route element={<Home />}>
          <Route path="/" element={<TableList />} />
          <Route path="/form" element={<AutoLayout />} />
          {/* <Route path="/chart" element={<Chart />} /> */}
          <Route path="/profile" element={<Profile />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/flowchart" element={<Flowchart />} />
          <Route path="/flowchart/:id" element={<Flowchart />} />
          <Route path="/report" element={<Report />} />
        </Route>
      </Route>
      <Route element={<PublicRoutes />}>
        <Route path="/login" element={<Login />} />
      </Route>
      <Route path="/realdashboard" element={<RealDashboard />} />
      <Route path="/chart-new" element={<NewChart />} />
    </Routes>
  )
}

export default AppRouter
