import { useState } from 'react'
import { axiosPost } from '../../../Services/AutoLayoutService'
import { handleParamValues } from '../../../Utils/ParamUtils'

function InputCheckbox({ info, param, flag }) {
  const [isChecked, setIsChecked] = useState(() =>
    info.getValue() === '1' ? true : false
  )

  const handleClick = async () => {
    const payload = {
      flagType: 'checkbox',
      flagAction: flag,
    }
    // handle param
    const handleParam = handleParamValues(param, '', info)
    Object.assign(payload, { param: handleParam })
    // set data checkbox
    await axiosPost('/setdatacheckbox', payload).then((res) => {
      if (res.data.status != '1') {
        return window.Swal.fire('', res.data.message, 'error')
      }
      if (isChecked) setIsChecked(false)
      else setIsChecked(true)
    })
  }

  return (
    <div className="d-flex justify-content-center">
      <div
        className="custom-control custom-checkbox"
        onClick={() => handleClick()}
      >
        <input
          type="checkbox"
          className="custom-control-input"
          checked={isChecked}
        />
        <label for="customCheckbox" class="custom-control-label"></label>
      </div>
    </div>
  )
}

export default InputCheckbox
