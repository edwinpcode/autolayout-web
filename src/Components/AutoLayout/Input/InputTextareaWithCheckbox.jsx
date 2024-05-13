import React, { useEffect, useState } from "react"

const InputTextareaWithCheckbox = ({
  checkbox,
  child,
  defaultValue,
  getValues,
  flag,
  hide,
  id,
  isMandatory,
  label,
  parent,
  path,
  register,
  resetField,
  setValue,
  watch,
  width,
  ...props
}) => {
  const [checked, setChecked] = useState(false)

  const onCheck = (checked) => {
    setChecked(checked)
  }

  let parentWatch = watch(parent)
  useEffect(() => {
    if (checked && parentWatch) {
      for (let i = 0; parentWatch.length; i++) {
        // resetField(child[i].id)
        // setValue(child[i], parentWatch[i])
        // console.log('childid: ', child[i])
        // console.log('parentid: ', parent[i])
        // console.log('parentvalue: ', parentWatch[i])
      }
    }
  }, [checked, parentWatch])

  return (
    <>
      <label className={`${hide ? "hidden" : ""}`}>
        {label}
        {isMandatory && (
          <span className="text-danger font-weight-bold"> *</span>
        )}
      </label>
      <div className={`input-group`}>
        <textarea
          defaultValue={defaultValue}
          {...register}
          id={id}
          className={`form-control`}
          {...props}
        />
      </div>
      <div className="form-check">
        <input
          className="form-check-input"
          type="checkbox"
          value={checked}
          onChange={(e) => onCheck(e.target.checked)}
        />
        <label className="form-check-label">{checkbox.label}</label>
      </div>
    </>
  )
}

export default InputTextareaWithCheckbox
