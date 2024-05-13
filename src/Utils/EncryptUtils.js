import CryptoJS from "crypto-js"
import moment from "moment"

var optionsRijndael = {
  mode: CryptoJS.mode.CBC,
  padding: CryptoJS.pad.Pkcs7,
}

function getDateKey() {
  const date = moment().locale("en")
  const ddd = date.format("ddd")
  const yyyy = date.format("YYYY")
  const mmdd = date.format("MMDD")
  const res = ddd + yyyy + mmdd + "00000"
  return res
}

const getKeyAES = (paramKey) => {
  let pwdBytes = CryptoJS.enc.Utf8.parse(paramKey)
  return pwdBytes
}

export const encryptAES = (text) => {
  const date = getDateKey()
  optionsRijndael.iv = getKeyAES(date)
  var aes = CryptoJS.algo.AES.createEncryptor(getKeyAES(date), optionsRijndael)
  var encrypted = aes.finalize(CryptoJS.enc.Utf8.parse(text))
  return CryptoJS.enc.Base64.stringify(encrypted)
}

export const decryptAES = (TeksSingDiEnkrip) => {
  try {
    const date = getDateKey()
    optionsRijndael.iv = getKeyAES(date)
    var aes = CryptoJS.algo.AES.createDecryptor(
      getKeyAES(date),
      optionsRijndael,
    )
    let dataBase64Enkrip = CryptoJS.enc.Base64.parse(TeksSingDiEnkrip)
    var decrypted = aes.finalize(dataBase64Enkrip)
    return CryptoJS.enc.Utf8.stringify(decrypted)
  } catch (err) {
    // console.log('error dec = ' + err.message)
  }
}
