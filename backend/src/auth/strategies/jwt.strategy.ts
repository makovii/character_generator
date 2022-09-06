import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import * as env from 'env-var';
import { User } from '../../user/user.model';

const PRIVATE_KEY = env
  .get('PRIVATE_KEY')
  .default('SOME_MSG')
  .required()
  .asString();

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: PRIVATE_KEY,
    });
  }

  async validate(payload: typeof User): Promise<typeof User> {
    return payload;
  }
}
