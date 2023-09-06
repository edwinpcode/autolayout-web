import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { getBoxForm } from '../../../Services/AuthService'
import { SkeletonDashboard } from '../Skeleton'

export default function BoxForm({ width, level, fieldId, path }) {
  const [menuDashboard, setMenuDashboard] = useState()

  const userId = useSelector((state) => state.user.id)

  useEffect(() => {
    getBoxForm(userId, level, fieldId, path).then((response) => {
      if (response.data.status === '1') {
        setMenuDashboard(response.data.content)
      }
    })
  }, [])

  return (
    <div>
      {!menuDashboard ? (
        <SkeletonDashboard />
      ) : (
        <div className="row">
          {menuDashboard?.map((menuDashboards, index) => {
            return (
              <div className={`col-lg-3 col-md-6 col-${width}`} key={index}>
                <div className={'small-box ' + menuDashboards.class}>
                  <div className="inner">
                    <h3>{menuDashboards.value}</h3>
                    <p>{menuDashboards.label}</p>
                  </div>
                  <div className="icon">
                    <i className={menuDashboards.icon}></i>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
