import APIClient, { APIAI, formDataConfig } from "./APIClient"

const voiceToText = async (payload) => {
  const config = formDataConfig
  const res = await APIClient.post("speechToText", payload, config)
  return res
}

const AIService = {
  voiceToText,
}

export default AIService
