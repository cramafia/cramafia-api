import { ResponseUserDto } from '../dto/respone-user.dto'
import { User } from '../schemas/user.schema'

export const format = (
  data: User | User[]
): ResponseUserDto | ResponseUserDto[] => {
  if (Array.isArray(data)) {
    return data.map(formatUser)
  }
  return formatUser(data)
}

const formatUser = ({ username, _id }: User): ResponseUserDto => {
  return {
    username,
    _id,
  }
}
