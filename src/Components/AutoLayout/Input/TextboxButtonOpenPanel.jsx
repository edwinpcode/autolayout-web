import React, { useEffect, useState } from 'react'

function TextboxButtonOpenPanel({
  id,
  label,
  button,
  defaultValue,
  getValues,
  hide,
  isMandatory,
  register,
  setValue,
  ...props
}) {
  const handleOnClick = () => {
    alert('mantap')
  }

  return (
    <>
      <label className={`${hide ? 'hidden' : ''}`}>
        {label}
        {isMandatory && (
          <span className="text-danger font-weight-bold"> *</span>
        )}
      </label>
      <div className="input-group">
        <input
          type="text"
          defaultValue={defaultValue}
          {...register}
          id={id}
          className="form-control"
          {...props}
        />
        <span className="input-group-append">
          <button
            type="button"
            className="btn btn-danger"
            onClick={handleOnClick}
          >
            {button[0].label}
          </button>
        </span>
      </div>
    </>
  )
}

export default TextboxButtonOpenPanel
