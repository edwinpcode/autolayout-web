import APIClient, { APIAI, formDataConfig } from "./APIClient"

const voiceToText = async (payload) => {
  const res = await APIClient.post("speechToText", payload, formDataConfig)
  return res
}

const AIService = {
  voiceToText,
}

export default AIService
