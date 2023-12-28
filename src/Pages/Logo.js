import React from "react"

function Logo() {
  return (
    <div>
      <img
        src={process.env.PUBLIC_URL + "/images/logo_1up.png"}
        alt="logo-login"
        className="w-100"
        // style={{
        //   width: "100px",
        //   height: "100px",
        // }}
      ></img>
    </div>
  )
}

export default Logo
