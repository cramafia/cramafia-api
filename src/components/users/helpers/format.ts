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

const formatUser = ({ username, _id, icon_url }: User): ResponseUserDto => {
  return {
    username,
    icon_url,
    _id,
  }
}
