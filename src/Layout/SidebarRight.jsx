import VoiceAssistant from "Components/Voice/VoiceAssistant"
import VoiceChat from "Components/Voice/VoiceChat"
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
        // width: "25vw",
      }}
    >
      <div className="control-sidebar-content">
        <VoiceChat />
      </div>
    </aside>
  )
}

export default SidebarRight
