import APIClient, { APIAI, formDataConfig } from "./APIClient"

const voiceToText = async (payload) => {
  const res = await APIClient.post("speechToText", payload, formDataConfig)
  return res
}

const faceRecognize = async (payload) => {
  const res = await APIClient.post("faceRecognize", payload, formDataConfig)
  return res
}

const faceRegister = async (payload) => {
  const res = await APIAI.post("fr/register", payload, formDataConfig)
  return res
}

const AIService = {
  voiceToText,
  faceRecognize,
  faceRegister,
}

export default AIService
