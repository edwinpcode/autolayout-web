export const handleParamValues = (param, getValues = (paramId) => '', info) => {
  const payloadParam = []
  if (!param) {
    window.Swal.fire('', 'Parameter is empty', 'warning')
    return []
  }
  param.forEach((paramId) => {
    payloadParam.push({
      id: paramId,
      value:
        info?.row.original[paramId] ||
        getValues(paramId) ||
        document.getElementById(paramId)?.value ||
        '',
    })
  })
  return payloadParam
}
