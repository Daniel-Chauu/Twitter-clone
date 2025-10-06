import jwt, { JwtPayload, SignOptions } from 'jsonwebtoken'

export interface TokenPayload extends JwtPayload {
  user_id: string
}

export const signToken = ({
  payload,
  secretKey,
  options
}: {
  payload: string | Buffer | object
  secretKey: string
  options?: SignOptions
}) => {
  return new Promise<string>((res, rej) => {
    jwt.sign(payload, secretKey, { algorithm: 'HS256', ...options }, function (err, encoded) {
      if (err) rej(err)
      res(encoded as string)
    })
  })
}

export const verifyToken = ({ secretKey, token }: { token: string; secretKey: string }) => {
  return new Promise<TokenPayload>((res, rej) => {
    jwt.verify(token, secretKey, function (err, decoded) {
      if (err) rej(err)
      res(decoded as TokenPayload)
    })
  })
}
