import React, { Suspense, lazy } from "react"
import { Route, Routes, BrowserRouter } from "react-router-dom"
import Home from "./Pages/Home"
import ProtectedRoutes from "./Router/ProctectedRoutes"
import PublicRoutes from "./Router/PublicRoutes"
import { NotFoundPage } from "Pages/NotFoundPage"

export const wait = (time) => {
  return new Promise((res) => {
    setTimeout(res, time)
  })
}

const Report = lazy(() => wait(1000).then(() => import("Pages/Report")))
const Profile = lazy(() => wait(1000).then(() => import("Pages/Profile")))
const Dashboard = lazy(() => wait(1000).then(() => import("Pages/Dashboard")))
const TableList = lazy(() => wait(1000).then(() => import("Pages/TableList")))
const Auth = lazy(() => wait(1000).then(() => import("Pages/Auth")))
const Login = lazy(() => wait(1000).then(() => import("Pages/Login")))
const DataTablePage = lazy(() =>
  wait(1000).then(() => import("Pages/DataTablePage")),
)

const Router = () => {
  return (
    <Routes history={BrowserRouter}>
      {/* <Route element={<Chart />} path="/chart" /> */}
      <Route element={<ProtectedRoutes />}>
        {/* <Route path="/form-builder" element={<Dnd />} /> */}
        {/* <Route path="/tester" element={<Tester />} /> */}
        <Route path="/auth" element={<Auth />} />
        {/* <Route path="/preview" element={<PreviewDocument />} /> */}
        <Route element={<Home />}>
          <Route path="/" element={<TableList />} />
          {/* <Route path="/:menuId" element={<TableList />} /> */}
          {/* <Route path="/:menuId/:id/:value" element={<TableList />} /> */}
          <Route path="/form" element={<TableList />} />
          {/* <Route path="/chart" element={<Chart />} /> */}
          <Route path="/profile" element={<Profile />} />
          <Route path="/dashboard" element={<TableList />} />
          <Route path="/beranda" element={<Dashboard />} />
          {/* <Route path="/flowchart" element={<Flowchart />} /> */}
          {/* <Route path="/flowchart/:id" element={<Flowchart />} /> */}
          <Route path="/report" element={<Report />} />
          <Route path="/datatable" element={<DataTablePage />} />
          {/* <Route path="/report/:menuId" element={<Report />} /> */}
        </Route>
      </Route>
      <Route element={<PublicRoutes />}>
        <Route path="/login" element={<Login />} />
      </Route>
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}

export default Router
