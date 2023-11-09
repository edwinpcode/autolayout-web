export const handleFieldRule = (fieldItem) => {
  const rule = {
    required:
      fieldItem?.isMandatory === '1' && fieldItem.isReadOnly !== '1'
        ? `${fieldItem.label} harus diisi`
        : false,
    pattern:
      fieldItem?.rule === 'email'
        ? {
            value:
              /^(?=[^@]{2,}@)(?=[^\.]{2,}\.)([\w\.-]*[a-zA-Z0-9_]@(?=.{2,}\.[^.]*$)[\w\.-]*[a-zA-Z0-9]\.[a-zA-Z][a-zA-Z\.]*[a-zA-Z])$/,
            message: `${fieldItem.label} harus sesuai`,
          }
        : fieldItem?.rule === 'alphaonly'
        ? {
            value: /^[a-zA-Z/ /]*$/,
            message: `${fieldItem.label} harus huruf`,
          }
        : false,
    shouldUnregister: true,
  }
  // max length
  if (fieldItem?.maxLength && fieldItem.maxLength !== '') {
    Object.assign(rule, {
      maxLength: {
        value: +fieldItem.maxLength,
        message: `${fieldItem.label} maksimal ${fieldItem.maxLength} karakter`,
      },
    })
  }
  // min length
  if (fieldItem?.minLength && fieldItem.minLength !== '') {
    Object.assign(rule, {
      minLength: {
        value: +fieldItem.minLength,
        message: `${fieldItem.label} minimal ${fieldItem.minLength} karakter`,
      },
    })
  }
  // min value
  if (fieldItem?.minValue && fieldItem.minValue !== '') {
    Object.assign(rule, {
      min: {
        value: +fieldItem.minValue,
        message: `${fieldItem.label} minimal ${fieldItem.minValue}`,
      },
    })
  }
  // max value
  if (fieldItem?.maxValue && fieldItem.maxValue !== '') {
    Object.assign(rule, {
      max: {
        value: +fieldItem.maxValue,
        message: `${fieldItem.label} maksimal ${fieldItem.maxValue}`,
      },
    })
  }

  return rule
}
