import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { InjectModel } from '@nestjs/sequelize';
import { User } from '../../users/entities/user.entity';
import { JwtPayload } from '../../_interfaces/jwt-payload';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(@InjectModel(User) private userModel: typeof User) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: 'a-very-secure-secret',
    });
  }

  async validate(payload: JwtPayload) {
    const user = await this.userModel.findOne({
      where: {
        id: payload.id,
        email: payload.email,
      },
    });

    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
