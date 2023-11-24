import React from "react";

function Logo() {
  return (
    <div>
      <img
        src={process.env.PUBLIC_URL + "/images/logo_favicon.svg"}
        alt="logo-login"
        // className="mw-50"
        style={{
          width: "100px",
          height: "100px",
        }}
      ></img>
    </div>
  );
}

export default Logo;
