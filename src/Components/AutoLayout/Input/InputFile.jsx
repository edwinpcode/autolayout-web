import { useEffect } from "react"
import bsCustomFileInput from "bs-custom-file-input"

function InputFile({ fieldItem, maxLength, register, ...props }) {
  const maxSizeValidation = (value) => {
    const maxSize = +fieldItem.maxLength * 1024 * 1024
    // if maxLength empty = no validation
    if (maxSize === 0) {
      return true
    }
    // if maxLength is set
    if (value[0]?.size > maxSize) {
      return `Ukuran file tidak boleh melebihi ${fieldItem.maxLength}MB`
    }
    // pass validation
    return true
  }

  useEffect(() => {
    bsCustomFileInput.init()
  }, [])

  return (
    <div className="form-group">
      <label>
        {fieldItem.label}
        {fieldItem.isMandatory === "1" && (
          <span className="text-danger font-weight-bold"> *</span>
        )}
      </label>
      <div className="custom-file">
        <input
          {...register(fieldItem.id, {
            required:
              fieldItem.isMandatory && fieldItem.isMandatory == "1"
                ? `Pilih ${fieldItem.label} terlebih dahulu`
                : false,
            validate: {
              maxSize: (value) => maxSizeValidation(value),
            },
          })}
          // accept={fieldItem.rule.toLowerCase()}
          type="file"
          id={fieldItem.id}
          className="custom-file-input"
          {...props}
        />
        <label className="custom-file-label">Pilih file</label>
      </div>
    </div>
  )
}

export default InputFile
