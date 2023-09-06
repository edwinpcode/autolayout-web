import React, { useMemo, useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getDashboard } from '../Services/AuthService'
import { setMenuSlice } from '../Store/Menu/menuSlice'
import { Link } from 'react-router-dom'
import { SkeletonDashboard } from '../Components/AutoLayout/Skeleton'
import { reset } from '../Store/List/listSlice'
import socket from '../Utils/SocketUtils'
import FullLoad from './FullLoad'
function Dashboard() {
  const dispatch = useDispatch()
  // state
  const [dashboardBox, setDashboardBox] = useState()
  const [loader, showLoader, hideLoader] = FullLoad()

  // redux
  const userId = useSelector((state) => state.user.id)
  const activeModuleId = useSelector((state) => state.user.activeModule.id)
  const activeRoleId = useSelector((state) => state.user.activeRole.id)
  const moduleId = useSelector((state) => state.user.activeModule.id)
  const roleId = useSelector((state) => state.user.activeRole.id)

  useEffect(() => {
    if (activeModuleId && activeRoleId)
      getDashboard(userId, activeModuleId, activeRoleId).then((response) => {
        if (response.data.status === '1') {
          setDashboardBox(response.data.content)
        }
      })
    hideLoader()
  }, [activeModuleId, activeRoleId])

  const handleMenuClick = (dashboardItem) => {
    const { track: trackId, menuId, description: menuDesc } = dashboardItem
    dispatch(setMenuSlice({ menuId, trackId, menuDesc }))
    dispatch(reset())
  }

  // send to nodejs
  // useEffect(() => {
  //   const token = localStorage.getItem('token')
  //   const payload = { token, userId, moduleId: '60', groupId: 'AO' }
  //   socket.emit('getDashboardBox', payload)
  //   socket.on('setDashboardBox', (data) => {
  //     console.log('set data baru box')
  //     setDashboardBox(data)
  //   })
  //   socket.on('refreshDashboard', () => {
  //     socket.emit('getDashboardBox', payload)
  //   })
  // }, [])

  return (
    <div>
      <h3>Dashboard</h3>
      {!dashboardBox ? (
        <SkeletonDashboard />
      ) : (
        <div className="row">
          {dashboardBox.map((dashboardItem, index) => {
            return (
              <div className="col-lg-3 col-md-6 col-12" key={index}>
                <div className={'small-box ' + dashboardItem.class}>
                  <div className="inner">
                    <h3>{dashboardItem.total}</h3>
                    <p>{dashboardItem.description}</p>
                  </div>
                  <div className="icon">
                    <i className={dashboardItem.icon}></i>
                  </div>
                  <Link
                    to={'/'}
                    onClick={() => handleMenuClick(dashboardItem)}
                    className="small-box-footer"
                  >
                    {' '}
                    Click here to see the list{' '}
                    <i className="fas fa-arrow-circle-right"></i>
                  </Link>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default Dashboard
