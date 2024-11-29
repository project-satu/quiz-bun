import { jwtConstants } from '@/constant/jwt.constant';
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConstants.secret,
    });
  }

  async validate(payload: any) {
    return {
      id: payload.id,
      uuid: payload.uuid,
      email: payload.email,
      name: payload.name,
      role: {
        id: payload.role.id,
        uuid: payload.role.uuid,
        name: payload.role.name,
        value: payload.role.value,
      },
    };
  }
}
