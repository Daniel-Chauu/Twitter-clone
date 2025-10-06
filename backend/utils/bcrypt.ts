import bcrypt from 'node_modules/bcryptjs'

const hashPassword = (password: string) => {
  const salt = bcrypt.genSaltSync(10)
  const hashedPassword = bcrypt.hashSync(password, salt)

  return hashedPassword
}

export { hashPassword }
