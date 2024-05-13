import { getReference } from "../Services/AutoLayoutService"

export const getFieldByFieldId = (fieldId, panelList) => {
  let resultField = {}
  console.log(panelList)
  panelList.forEach((panelItem) => {
    // prettier-ignore
    let findField = panelItem.listField?.data?.find(
        (fieldItem) => fieldItem.id === fieldId,
      )
    if (findField) resultField = findField
    let field
    if (Array.isArray(panelItem.listField)) {
      field = panelItem.listField.find((item) => item.id === fieldId)
    } else {
      field = panelItem.listField.data.find((item) => item.id === fieldId)
    }
    if (field) resultField = field
  })
  return resultField
}

export const getChildValueByChildParent = (
  childId,
  panelList,
  getValues,
  setValue,
) => {
  let emptyField = false
  const payload = { referenceName: childId, param: [] }
  // find child field
  // console.log(childId, panelList)
  let childField = getFieldByFieldId(childId, panelList)
  // get child parent
  // console.log(childField)
  if (childField && childField.reference) {
    childField.reference?.parent.forEach((parentId) => {
      const parentValue = getValues(parentId)
      payload.param.push({ id: parentId, value: parentValue })
      if (!parentValue || parentValue === "") {
        emptyField = true
      }
    })
  }
  // if doenst has empty field value
  if (!emptyField) {
    // get child value by payload
    getReference(payload).then((res) => {
      if (res.data.status != "1") {
        return window.Swal.fire("", res.data.message, "error")
      }
      // set response value to child
      if (res.data.data.length) {
        setValue(childId, res.data.data[0].value, { shouldValidate: true })
        const childEl = document.getElementById(childId)
        childEl.dispatchEvent(new Event("change"))
      }
    })
  }
}
