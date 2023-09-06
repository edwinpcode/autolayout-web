import React from 'react'

function Logo() {
  return (
    <div>
      <img
        src={process.env.PUBLIC_URL + '/images/logo_login.png'}
        alt="logo-login"
        className="mw-100"
      ></img>
    </div>
  )
}

export default Logo
