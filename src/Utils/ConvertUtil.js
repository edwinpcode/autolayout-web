export const converttoNewScale = (value) => {
  const oldMax = 255
  const oldMin = 128
  const newMin = 0
  const newMax = 100

  const newValue =
    ((value - oldMin) / (oldMax - oldMin)) * (newMax - newMin) + newMin
  return newValue
}

const ConvertUtil = {
  converttoNewScale,
}

export default ConvertUtil
