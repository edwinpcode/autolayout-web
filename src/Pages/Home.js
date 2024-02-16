import React, { useEffect, useState } from "react"
import { Outlet, useNavigate } from "react-router-dom"
import { useSelector } from "react-redux"
import Header from "../Layout/Header"
import SideBar from "../Layout/SideBar"
import AuthStepperContent from "../Components/Stepper/AuthStepperContent"
import BackTop from "./BackTop"
import Load from "../Pages/FullLoad"
import Inbox from "../Components/Inbox"

function Home() {
  const navigate = useNavigate()

  const menu = useSelector((state) => state.menu)

  const tokenLogout = localStorage.getItem("accessToken")

  // loading
  const [loader, showLoader, hideLoader] = Load()

  useEffect(() => {
    // showLoader()
    //if token null
    if (tokenLogout === null) {
      return navigate("/login")
    }
    // if menu not selected
    if (menu.activeMenuId === "") {
      // hideLoader()
      return navigate("/dashboard")
    }
  }, [])

  return (
    <div className="wrapper">
      <Header />
      <SideBar />
      <div className="content-wrapper flex-fill">
        {/* <div className="content-header pb-0">
          <div className="container-fluid">
            <div className="row mb-2">
              <div className="col-sm-6">
                <h1 className="m-0 text-dark">{menu.activeMenuDesc}</h1>
              </div>
            </div>
          </div>
        </div> */}
        <section className="content pt-3">
          <div className="container-fluid">
            <div className="card">
              <div className="card-body" style={{ minHeight: "90vh" }}>
                <Outlet />
              </div>
            </div>
          </div>
        </section>
        <BackTop />
      </div>
      {loader}
    </div>
  )
}

export default Home
