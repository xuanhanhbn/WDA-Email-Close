import jwt from 'jsonwebtoken'

const secret = 'leodeptrai'

export function parseToken(token) {
  try {
    const decodedToken = jwt.decode(token)

    return decodedToken
  } catch (error) {
    // Xử lý lỗi xác minh token
    return null
  }
}
