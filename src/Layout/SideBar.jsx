import React, { useMemo, useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import {
  NavLink,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom"
import { getMenu } from "../Services/MenuService"
import { setMenuSlice } from "../Store/Menu/menuSlice"
import { reset, setFilteringList } from "../Store/List/listSlice"
import {
  setMenuSidebarSlice,
  setSearchMenu,
} from "../Store/Menu/menuSidebarSlice"

const metaTags = document.getElementsByTagName("meta")
const metaTagsArray = Array.from(metaTags)

const applicationNameTag = metaTagsArray.find((tag) => {
  return tag.getAttribute("name") === "application-name"
})

const applicationName = applicationNameTag.getAttribute("content")

const MenuChild = ({ child, handleMenuClick }) => {
  return (
    <ul
      className="nav nav-treeview "
      data-widget="treeview"
      data-accordion="false"
    >
      {child.map((item, index) => (
        <Menu data={item} key={index} handleMenuClick={handleMenuClick} />
      ))}
    </ul>
  )
}

const Menu = ({ data, handleMenuClick }) => {
  const activeMenuId = useSelector((state) => state.menu.activeMenuId)
  return (
    <li className="nav-item" id={data.menuId}>
      <NavLink
        to={`${data.child ? "#" : data.path}`}
        onClick={() => handleMenuClick(data)}
        className={() => {
          if (data.menuId === activeMenuId) {
            return "nav-link active"
          } else {
            return "nav-link"
          }
        }}
      >
        {data.icon !== "" ? (
          <i className={"nav-icon " + data.icon}></i>
        ) : (
          <i className={"nav-icon fal fa-circle"}></i>
        )}
        <p>
          {data.menuDesc}
          {data.child && <i className="right fas fa-angle-left"></i>}
        </p>
      </NavLink>
      {data.child && (
        <MenuChild child={data.child} handleMenuClick={handleMenuClick} />
      )}
    </li>
  )
}

const MenuAll = ({ data, handleMenuClick }) => {
  const activeMenuId = useSelector((state) => state.menu.activeMenuId)
  return (
    <li className="nav-item" id={data.menuId}>
      <NavLink
        to={`${data.child ? "#" : data.path}`}
        onClick={() => handleMenuClick(data)}
        className={() => {
          if (data.menuId === activeMenuId) {
            return "nav-link active"
          } else {
            return "nav-link"
          }
        }}
      >
        {data.icon !== "" ? (
          <i className={"nav-icon " + data.icon}></i>
        ) : (
          <i className={"nav-icon fal fa-circle"}></i>
        )}
        <p>
          {data.menuDesc}
          {data.child && <i className="right fas fa-angle-left"></i>}
        </p>
      </NavLink>
      {data.child && (
        <ul
          className="nav nav-treeview "
          data-widget="treeview"
          data-accordion="false"
        >
          {data.child.map((item, index) => (
            <li className="nav-item" key={index}>
              <NavLink
                to={`${item.child ? "#" : item.path}`}
                onClick={() => handleMenuClick(item)}
                className={() => {
                  if (item.menuId === activeMenuId) {
                    return "nav-link active"
                  } else {
                    return "nav-link"
                  }
                }}
              >
                {item.icon !== "" ? (
                  <i className={"nav-icon " + item?.icon}></i>
                ) : (
                  <i className={"nav-icon fal fa-circle"}></i>
                )}
                <p>{item.menuDesc}</p>
              </NavLink>
            </li>
          ))}
        </ul>
      )}
    </li>
  )
}

function SideBar() {
  const dispatch = useDispatch()
  const { state } = useLocation()
  // redux state
  const userId = useSelector((state) => state.user.id)
  const activeMenuId = useSelector((state) => state.menu.activeMenuId)
  const activeModuleId = useSelector((state) => state.user.activeModule.id)
  const activeRoleId = useSelector((state) => state.user.activeRole.id)
  // state
  const [menu, setMenu] = useState([])
  const [searchSidebarValue, setSearchSidebarValue] = useState("")
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const [show, setShow] = useState(false)
  const [hover, setHover] = useState(false)
  const [loading, setLoading] = useState(true)
  const darkMode = useSelector((state) => state.theme.darkMode)

  useEffect(() => {
    if (activeModuleId && activeRoleId) {
      // handle menu data
      setLoading(true)
      getMenu(userId, activeModuleId, activeRoleId)
        .then((res) => {
          // if (res.data.status != "1") {
          //   return window.Swal.fire("Kesalahan", res.data.message, "error")
          // }
          if (res.data.status == "1") {
            setMenu(res.data.data)
            dispatch(setMenuSidebarSlice(res.data.data))
          }
        })
        .catch((e) => window.Swal.fire("Kesalahan", e.message, "error"))
        .finally(() => setLoading(false))
    }
  }, [activeModuleId, activeRoleId])

  const filteredMenu = useMemo(() => {
    if (menu) {
      // get parent menu by searched value
      const parentMenu = menu.filter((data) => {
        const menuLower = data.menuDesc.toLowerCase()
        const searchedValueLower = searchSidebarValue.toLowerCase()
        return menuLower.includes(searchedValueLower)
      })
      // get child menu by searched value
      const childMenu = menu.filter((data) => {
        const searchedValueLower = searchSidebarValue.toLowerCase()
        if (data.child) {
          return data.child.some((child) =>
            child.menuDesc.toLowerCase().includes(searchedValueLower),
          )
        }
      })
      // combine parent & child menu
      return [...new Set([...parentMenu, ...childMenu])]
    }
  }, [menu, searchSidebarValue]) // trigger on [menu, searchSidebarValue] changed

  // useEffect(() => {
  //   window.$('[data-widget="treeview"]').Treeview('init')
  // })

  const handleMenuClick = (data, treeviewId) => {
    const hasChild = data.child || false
    const { menuDesc, menuId, trackId, path } = data
    if (!hasChild) {
      // set active menu
      // setSearchParams({
      //   menuId,
      //   trackId,
      // })
      // console.log(data)
      dispatch(setMenuSlice({ menuId, trackId, menuDesc, path }))
      dispatch(setFilteringList([]))
      dispatch(reset())
      dispatch(setSearchMenu(""))
      document.getElementById("body").classList.add("sidebar-collapse")
    }
    // console.log(treeviewId)
    if (hasChild) {
      const menu = document.getElementById(menuId)
      if (menu) {
        menu.classList.toggle("menu-open")
      }
    }
  }

  return (
    <aside
      className={`main-sidebar elevation-4 ${
        darkMode ? "sidebar-dark-success" : "sidebar-light-success"
      }`}
      id={"sidebar"}
    >
      <a href="/" className="brand-link">
        {show ? (
          <img
            src="/images/logo_1up.png"
            alt="App Logo"
            className="brand-image"
          />
        ) : (
          <img
            src="/images/logo_1up_sidebar.png"
            alt="App Logo"
            className="brand-image"
          />
        )}
        <span className="brand-text">Satu Untuk Pegadaian</span>
      </a>

      <div className="sidebar">
        {loading && <span>Loading...</span>}
        <nav className="my-3">
          {/* <div className="px-3 mb-3">
            <input
              className="form-control form-control-sidebar"
              type="text"
              placeholder="Search"
              onChange={(e) => setSearchSidebarValue(e.target.value)}
            />
          </div> */}
          <ul
            className="nav nav-pills nav-sidebar flex-column"
            // data-widget="treeview"
            // data-accordion="true"
          >
            {filteredMenu?.map((data, index) => (
              <Menu data={data} key={index} handleMenuClick={handleMenuClick} />
            ))}
          </ul>
        </nav>
      </div>
    </aside>
  )
}

export default SideBar
