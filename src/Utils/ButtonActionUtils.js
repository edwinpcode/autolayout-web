import { saveForm } from '../Services/AutoLayoutService'

export const handleSaveData = async (
  endpoint,
  data,
  actionItem,
  showLoader,
  hideLoader
) => {
  const payload = {
    panel: [{ field: [] }],
    param: [],
  }
  // mapping fieldId & fieldValue to payload
  for (let [fieldId, fieldValue] of Object.entries(data)) {
    payload.panel[0].field.push({ fieldId, fieldValue })
  }
  // set payload param
  actionItem.url.param.forEach((paramId) => {
    const paramValue = document.getElementById(paramId).value
    payload.param.push({ id: paramId, value: paramValue })
  })
  // save data
  await saveForm(endpoint, payload).then((res) => {
    showLoader()
    if (res.data.status != '1') {
      hideLoader()
      return window.Swal.fire('Kesalahan', res.data.message, 'error')
    }
    hideLoader()
    window.Swal.fire('Berhasil', res.data.message, 'success')
  })
}
