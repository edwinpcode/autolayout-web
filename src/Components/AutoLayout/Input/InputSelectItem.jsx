import React, { useState } from 'react'

const InputSelectItem = ({ setSelected, param, item, info }) => {
  const [checked, setChecked] = useState(false)

  const handleClick = async () => {
    if (checked) {
      setChecked(false)
    } else {
      console.log(info.row.original)
      setChecked(true)
    }
  }

  return (
    <div className="d-flex justify-content-center">
      <div className="custom-control custom-checkbox" onClick={handleClick}>
        <input
          type="checkbox"
          className="custom-control-input"
          checked={checked}
          onChange={(e) => setChecked(e.target.checked)}
        />
        <label
          htmlFor="customCheckbox"
          className="custom-control-label"
        ></label>
      </div>
    </div>
  )
}

export default InputSelectItem
