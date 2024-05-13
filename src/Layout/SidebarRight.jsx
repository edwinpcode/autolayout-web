import VoiceAssistant from "Components/Voice/VoiceAssistant"
import React from "react"
import { useSelector } from "react-redux"

const SidebarRight = () => {
  const darkMode = useSelector((state) => state.theme.darkMode)

  return (
    <aside
      className={`control-sidebar ${
        darkMode ? "control-sidebar-dark" : "control-sidebar-light"
      }`}
      style={{
        bottom: 0,
      }}
    >
      <div className="control-sidebar-content p-3">
        <div className="row">
          {/* <VoiceAssistant className={"d-block"} /> */}
        </div>
      </div>
    </aside>
  )
}

export default SidebarRight
