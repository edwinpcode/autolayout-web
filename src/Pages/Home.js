import React, { Suspense, lazy, useEffect } from "react"
import { Outlet, useNavigate } from "react-router-dom"
import { useSelector } from "react-redux"
// import Header from "../Layout/Header"
// import SideBar from "../Layout/SideBar"
// import BackTop from "./BackTop"
import Load from "../Pages/FullLoad"
import { wait } from "Router"

const BackTop = lazy(() => import("./BackTop"))
const Header = lazy(() => wait(1000).then(() => import("Layout/Header")))
const Sidebar = lazy(() => wait(1000).then(() => import("Layout/SideBar")))

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
      return navigate("/beranda")
    }
  }, [])

  return (
    <div className="wrapper">
      <Suspense fallback={<span>Loading...</span>}>
        <Header />
        <Sidebar />
      </Suspense>
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
                <Suspense fallback={<h1>Loading...</h1>}>
                  <Outlet />
                </Suspense>
              </div>
            </div>
          </div>
        </section>
        <Suspense>
          <BackTop />
        </Suspense>
      </div>
      {loader}
    </div>
  )
}

export default Home
