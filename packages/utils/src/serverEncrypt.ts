import { hashSync, compareSync } from 'bcrypt'

export const encryptPasswordForDb = (password: string) => hashSync(password, 10)

export const comparePasswords = (pwdPassedIn: string, pwdToCompare: string) => {
  return compareSync(pwdPassedIn, pwdToCompare)
}
