import CryptoJS from 'crypto-js'

export const encrypt = word => {
  const key = CryptoJS.enc.Utf8.parse('guangzhouyangpkj')
  const srcs = CryptoJS.enc.Utf8.parse(word)
  const encrypted = CryptoJS.AES.encrypt(srcs, key, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7,
  })
  return encrypted.toString()
}
export const decrypt = word => {
  const key = CryptoJS.enc.Utf8.parse('guangzhouyangpkj')
  const decrypt = CryptoJS.AES.decrypt(word, key, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7,
  })
  return CryptoJS.enc.Utf8.stringify(decrypt).toString()
}
