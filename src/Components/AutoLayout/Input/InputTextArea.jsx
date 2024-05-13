import { useEffect } from "react"
import { handleFieldRule } from "Utils/FieldRuleUtils"

function InputTextArea({ fieldItem, register, defaultValue, setValue }) {
  useEffect(() => {
    setValue(fieldItem.id, defaultValue)
  }, [defaultValue])

  return (
    <>
      <label>
        {fieldItem.label}{" "}
        {fieldItem.isMandatory === "1" && (
          <span className="text-danger font-weight-bold"> *</span>
        )}
      </label>
      <textarea
        id={fieldItem.id}
        className="form-control"
        rows="3"
        placeholder={`Masukkan ${fieldItem.label}`}
        readOnly={fieldItem.isReadOnly === "1"}
        defaultValue={defaultValue || ""}
        {...register(fieldItem.id, handleFieldRule(fieldItem))}
      ></textarea>
    </>
  )
}

export default InputTextArea
