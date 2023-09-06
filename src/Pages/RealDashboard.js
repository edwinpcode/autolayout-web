import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getDashboard } from '../Services/AuthService'
import { setMenuSlice } from '../Store/Menu/menuSlice'
import { Link } from 'react-router-dom'
import { SkeletonDashboard } from '../Components/AutoLayout/Skeleton'
import RealChart from './RealChart'
import socket from '../Utils/SocketUtils'

function Dashboard() {
  const dispatch = useDispatch()
  const [menuDashboard, setMenuDashboard] = useState()
  const [dashboarReal, setMenuDashboardReal] = useState()

  const userId = useSelector((state) => state.user.id)
  const activeModuleId = useSelector((state) => state.user.activeModule.id)
  const activeRoleId = useSelector((state) => state.user.activeRole.id)

  useEffect(() => {
    if (activeModuleId && activeRoleId)
      getDashboard(userId, activeModuleId, activeRoleId).then((response) => {
        if (response.data.status === '1') {
          setMenuDashboard(response.data.content)
        }
      })
  }, [activeModuleId, activeRoleId])

  const handleMenuClick = (menuDashboards) => {
    const { track: trackId, menuId, description: menuDesc } = menuDashboards
    dispatch(setMenuSlice({ menuId, trackId, menuDesc }))
  }

  useEffect(() => {
    socket.on('message', (data) => {
      setMenuDashboardReal(data)
    })
  }, [])

  return (
    <div className="container">
      {!dashboarReal ? (
        <SkeletonDashboard />
      ) : (
        <>
          <h3>Dashboard</h3>
          {dashboarReal.map((data, index) => {
            if (data.type === 'realbox') {
              return (
                <div className="row" key={index}>
                  {data.value.map((menuDashboards, index) => {
                    return (
                      <div className="col-lg-3 col-md-6 col-12" key={index}>
                        <div className={'small-box ' + menuDashboards.class}>
                          <div className="inner">
                            <h3>{menuDashboards.total}</h3>
                            <p>{menuDashboards.description}</p>
                          </div>
                          <div className="icon">
                            <i className={menuDashboards.icon}></i>
                          </div>
                          <Link
                            to={'/'}
                            onClick={() => handleMenuClick(menuDashboards)}
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
              )
            }
            if (data.type === 'realchart') {
              return (
                <div className="row" key={index}>
                  {data.value.map((chart, index) => (
                    <div className={`col-md-${chart.width}`} key={index}>
                      {chart.fieldType === 'chart' && (
                        <RealChart chart={chart.valueList[0]} />
                      )}
                    </div>
                  ))}
                </div>
              )
            }
          })}
        </>
      )}
    </div>
  )
}

export default Dashboard
