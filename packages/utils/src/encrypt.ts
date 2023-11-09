import { AES, enc, mode, pad } from 'crypto-js'

const key = 'JINGO'

const options = {
  iv: enc.Hex.parse('0000000000000000'),
  mode: mode.ECB,
  padding: pad.Pkcs7,
}

export const encryptPassword = (password: string) => {
  return AES.encrypt(password, key, options).toString()
}

export const decryptPassword = (password: string) => {
  return AES.decrypt(password, key, options).toString()
}
