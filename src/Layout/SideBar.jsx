import React, { useMemo, useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import { getMenu } from '../Services/MenuService'
import { setMenuSlice } from '../Store/Menu/menuSlice'
import { reset } from '../Store/List/listSlice'
import { setMenuSidebarSlice } from '../Store/Menu/menuSidebarSlice'

const metaTags = document.getElementsByTagName('meta')
const metaTagsArray = Array.from(metaTags)

const applicationNameTag = metaTagsArray.find((tag) => {
  return tag.getAttribute('name') === 'application-name'
})

const applicationName = applicationNameTag.getAttribute('content')

function SideBar() {
  const dispatch = useDispatch()
  const { state } = useLocation()
  // redux state
  const userId = useSelector((state) => state.user.id)
  const activeMenuId = useSelector((state) => state.menu.activeMenuId)
  const activeModuleId = useSelector((state) => state.user.activeModule.id)
  const activeRoleId = useSelector((state) => state.user.activeRole.id)
  // state
  const [menu, setMenu] = useState()
  const [searchSidebarValue, setSearchSidebarValue] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    if (activeModuleId && activeRoleId) {
      // handle menu data
      getMenu(userId, activeModuleId, activeRoleId)
        .then((res) => {
          if (res.data.status != '1') {
            return window.Swal.fire('', res.data.message, 'error')
          }
          setMenu(res.data)
          dispatch(setMenuSidebarSlice(res.data.data))
        })
        .catch((e) =>
          window.Swal.fire('Kesalahan', e.response.message, 'error')
        )
    }
  }, [activeModuleId, activeRoleId])

  const filteredMenu = useMemo(() => {
    if (menu) {
      // get parent menu by searched value
      const parentMenu = menu.data.filter((data) => {
        const menuLower = data.menuDesc.toLowerCase()
        const searchedValueLower = searchSidebarValue.toLowerCase()
        return menuLower.includes(searchedValueLower)
      })
      // get child menu by searched value
      const childMenu = menu.data.filter((data) => {
        const searchedValueLower = searchSidebarValue.toLowerCase()
        if (data.child) {
          return data.child.some((child) =>
            child.menuDesc.toLowerCase().includes(searchedValueLower)
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
    if (!hasChild) {
      const { menuDesc, menuId, trackId } = data
      // set active menu
      dispatch(setMenuSlice({ menuId, trackId, menuDesc }))
      dispatch(reset())
    }
    // console.log(treeviewId)
    if (treeviewId && hasChild) {
      document.getElementById(treeviewId).classList.toggle('menu-open')
    }
  }

  return (
    <aside className="main-sidebar elevation-4 sidebar-light-danger">
      <a href="/" className="brand-link">
        <img
          src="/images/logo_sidebar.png"
          alt="App Logo"
          className="brand-image"
        />
        <span className="brand-text font-weight-bold">{applicationName}</span>
      </a>

      <div className="sidebar">
        <nav className="my-3">
          <div className="px-3 mb-3">
            <input
              className="form-control form-control-sidebar"
              type="text"
              placeholder="Search"
              onChange={(e) => setSearchSidebarValue(e.target.value)}
            />
          </div>
          <ul
            className="nav nav-pills nav-sidebar flex-column"
            // data-widget="treeview"
            // data-accordion="true"
          >
            {filteredMenu?.map((data, index) => {
              return (
                <li className="nav-item" key={index} id={`treeview${index}`}>
                  {/* parent menu */}
                  <NavLink
                    to={data.child ? '#' : data.path}
                    state={data.path !== '/' ? { param: [] } : state}
                    onClick={() => handleMenuClick(data, `treeview${index}`)}
                    className={() => {
                      if (data.menuId === activeMenuId) {
                        return 'nav-link active'
                      } else {
                        return 'nav-link'
                      }
                    }}
                  >
                    {data.icon !== '' ? (
                      <i className={'nav-icon ' + data.icon}></i>
                    ) : (
                      <i className={'nav-icon fal fa-circle'}></i>
                    )}
                    <p>
                      {data.menuDesc}
                      {data.child && (
                        <i className="right fas fa-angle-left"></i>
                      )}
                    </p>
                  </NavLink>
                  {/* child menu */}
                  {data.child && (
                    <ul
                      className="nav nav-treeview "
                      data-widget="treeview"
                      data-accordion="false"
                    >
                      {data.child.map((child, index) => (
                        <li className="nav-item" key={index}>
                          <NavLink
                            to={child.path}
                            onClick={() => handleMenuClick(child)}
                            className={() => {
                              if (child.menuId === activeMenuId) {
                                return 'nav-link active'
                              } else {
                                return 'nav-link'
                              }
                            }}
                          >
                            {child.icon !== '' ? (
                              <i className={'nav-icon ' + child?.icon}></i>
                            ) : (
                              <i className={'nav-icon fal fa-circle'}></i>
                            )}
                            <p>{child.menuDesc}</p>
                          </NavLink>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              )
            })}
          </ul>
        </nav>
      </div>
    </aside>
  )
}

export default SideBar
