import { getReference } from "../Services/AutoLayoutService"

const FieldCascadingUtil = async (fieldList, id, getValues, setValue) => {
  const payload = { referenceName: id, param: [] }

  const field = fieldList.find((item) => item.id === id)
  field.reference.parent.forEach((parentId) => {
    const parentValue = getValues(parentId)
    console.log(parentValue)
    const found = payload.param.find((item) => item.value == parentValue)
    if (!found) payload.param.push({ id: parentId, value: parentValue })
  })
  const param = payload.param
  const isEmpty = param.find((item) => item.value === "")
  // console.log(payload)
  if (isEmpty) return
  try {
    const res = await getReference(payload)
    setValue(id, res.data.data[0].value)
    return res.data
  } catch (error) {
    return error
  }
}

export default FieldCascadingUtil
