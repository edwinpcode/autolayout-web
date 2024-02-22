import {
  removeHiddenField,
  setHiddenField,
} from "../Store/HiddenElement/hiddenElementSlice"

const handleShowValue = (fieldItem) => {
  if (fieldItem.value !== "") return fieldItem.value
  if (fieldItem.valueList?.length) return fieldItem.valueList[0]?.value
  // default
  return ""
}

const handleReadOnlySetting = (id, isReadOnly) => {
  if (isReadOnly) {
    const el = document.getElementById(id)
    // if input is numeric (sementara detect by type)
    if (el.type === "hidden") {
      el.nextElementSibling.readOnly = false
    } else {
      el.readOnly = false
    }
  }
}

export const handleConditionValue = (
  currentValue,
  panelList,
  condition,
  dispatch,
  setValue,
) => {
  condition.forEach((conditionItem) => {
    if (conditionItem.value.includes(currentValue)) {
      conditionItem.setting.forEach(async (setting) => {
        const targetEl = document.getElementById(setting.id)
        if (targetEl) {
          if (setting.property.visible === "1") {
            // SHOW CONDITION
            // show condition for input / select element
            if (setting.type === "field") {
              try {
                await dispatch(removeHiddenField(setting.id))
                handleReadOnlySetting(setting.id, setting.property.isReadOnly)
              } catch (error) {
                console.log(error.message)
              }
            }
            // show condition for panel element
            else {
              let visibleFieldId = []
              targetEl.style.display = "block"
              const filteredPanel = panelList.find(
                (panelItem) => panelItem.panelId === setting.id,
              )
              // set every field value inside panel to '' (empty string)
              filteredPanel.listField.forEach((fieldItem) => {
                visibleFieldId.push(fieldItem.id)
                // setValue(fieldItem.id, handleShowValue(fieldItem))
              })
              dispatch(removeHiddenField(visibleFieldId))
            }
          } else {
            // HIDE CONDITION
            let hiddenFieldId = []
            // hide condition for field
            if (setting.type === "field") {
              hiddenFieldId.push(setting.id)
            }
            // hide condition for panel
            else {
              targetEl.style.display = "none"
              // prettier-ignore
              const filteredPanel = panelList.find((panelItem) => panelItem.panelId === setting.id)
              // set every field value inside panel to '-'
              filteredPanel.listField.forEach((fieldItem) => {
                hiddenFieldId.push(fieldItem.id)
              })
            }
            dispatch(setHiddenField(hiddenFieldId))
          }
        }
      })
    }
  })
}
