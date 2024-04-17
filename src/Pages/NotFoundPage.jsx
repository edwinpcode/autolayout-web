import React from "react"
import { useNavigate } from "react-router-dom"

export const NotFoundPage = () => {
  const nav = useNavigate()

  const goBack = () => {
    nav(-1)
  }
  return (
    <div className="d-flex justify-content-center align-items-center h-100">
      <div className="text-center">
        <div className="text-bold text-xl">Not Found - 404</div>
        <div className="text-lg">Please Return</div>
        <button className="btn btn-success" onClick={goBack}>
          <i className="fa fa-arrow-left"></i>
          Kembali
        </button>
      </div>
    </div>
  )
}
