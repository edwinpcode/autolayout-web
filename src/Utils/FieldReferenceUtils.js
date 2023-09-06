import { getReference } from '../Services/AutoLayoutService'

export const getFieldByFieldId = (fieldId, panelList) => {
  let resultField = {}
  panelList.forEach((panelItem) => {
    // prettier-ignore
    let findField = panelItem.listField.find((fieldItem) => fieldItem.id === fieldId)
    if (findField) resultField = findField
  })
  return resultField
}

export const getChildValueByChildParent = (
  childId,
  panelList,
  getValues,
  setValue
) => {
  let emptyField = false
  const payload = { referenceName: childId, param: [] }
  // find child field
  let childField = getFieldByFieldId(childId, panelList)
  // get child parent
  childField.reference.parent.forEach((parentId) => {
    const parentValue = getValues(parentId)
    payload.param.push({ id: parentId, value: parentValue })
    if (!parentValue || parentValue === '') {
      emptyField = true
    }
  })
  // if doenst has empty field value
  if (!emptyField) {
    // get child value by payload
    getReference(payload).then((res) => {
      if (res.data.status != '1') {
        return window.Swal.fire('', res.data.message, 'error')
      }
      // set response value to child
      if (res.data.data.length) {
        setValue(childId, res.data.data[0].value, { shouldValidate: true })
        const childEl = document.getElementById(childId)
        childEl.dispatchEvent(new Event('change'))
      }
    })
  }
}
