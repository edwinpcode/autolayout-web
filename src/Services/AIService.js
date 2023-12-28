import { APIAI, formDataConfig } from "./APIClient"

const voiceToText = async (payload) => {
  const config = formDataConfig
  const res = await APIAI.post("stt/speak/upload", payload, config)
  return res
}

const AIService = {
  voiceToText,
}

export default AIService
