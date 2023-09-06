import React from 'react'

function Loading() {
  return (
    <div
      style={{
        position: 'fixed',
        width: '100%',
        height: '100%',
        top: 0,
        left: 0,
        backgroundColor: 'transparent',
        zIndex: 9999,
      }}
    >
      <div
        style={{
          position: 'fixed',
          width: '100%',
          height: '100%',
          top: 0,
          left: 0,
          zIndex: -999,
          opacity: '60%',
          backgroundColor: '#fff',
        }}
      ></div>
      <div className="lockscreen-wrapper">
        <div className="tab-loading" style={{ marginTop: '250px' }}>
          <div style={{ textAlign: 'center', zIndex: 99999999 }}>
            <h2 className="display-4">
              <i className="fa fa-sync fa-spin"></i>
            </h2>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Loading
