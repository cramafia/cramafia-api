import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { UsersService } from '../users/users.service'

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest()
    try {
      const authHeader = req.headers.authorization
      const token = authHeader.split(' ')[1]
      if (!token) {
        throw new UnauthorizedException({ message: 'User not authorized' })
      }

      const user = this.jwtService.verify(token)
      req.user = await this.usersService.getUserByUsername(user.username)
      return true
    } catch (e) {
      throw new UnauthorizedException({ message: 'User not authorized' })
    }
  }
}
