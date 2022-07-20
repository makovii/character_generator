import {
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { ROLE } from '../constants';
import * as Response from '../response.messages';
import { ROLE_KEY } from './checkRole.decorator';
import { GenerateToken } from './dto/generate-token.dto';
import { AuthService } from './auth.service';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(
  private reflector: Reflector,
  private authService: AuthService 
  ) {
  super();
  }

  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }

  async handleRequest(_err: never, user: GenerateToken, _info: never, context: ExecutionContext) {

    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLE_KEY, [
      context.getHandler(),
      context.getClass(),
    ])

    if (requiredRoles && !requiredRoles.includes(ROLE[user.roleId])){
      throw new HttpException(Response.NO_ACCESS, HttpStatus.FORBIDDEN);
    }

    if (!await this.authService.checkIsActive(user.tokenId)) {
      throw new HttpException(Response.AUTHENTICATED_ERROR, HttpStatus.BAD_REQUEST);
    }
    return user
  }
}
