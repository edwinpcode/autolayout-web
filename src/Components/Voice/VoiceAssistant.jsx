import React, { useEffect, useRef, useState } from "react"
import { useForm } from "react-hook-form"
import AIService from "Services/AIService"
import ConvertUtil from "Utils/ConvertUtil"
import VoiceChat from "./VoiceChat"

const VoiceAssistant = ({ className }) => {
  return (
    <div className={`d-none ${className}`} id="assistant">
      <div
        className="card card-success"
        style={{
          height: "85vh",
        }}
      >
        <div className="card-header">
          <div className="card-title">Virtual Assistant</div>
          <div className="card-tools">
            <button
              type="button"
              className="btn btn-tool"
              data-card-widget="maximize"
            >
              <i className="fas fa-expand"></i>
            </button>
          </div>
        </div>
        <div className="card-body">
          <VoiceChat />
        </div>
      </div>
    </div>
  )
}

export default VoiceAssistant
