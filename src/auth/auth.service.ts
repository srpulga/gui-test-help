import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from '../users/entities/user.entity';
import * as bcrypt from 'bcrypt';
import { JwtPayload } from '../_interfaces/jwt-payload';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User) private userModel: typeof User,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.userModel.findOne({ where: { email } });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await this.validatePassword(
      password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return user;
  }

  async login(dto: LoginDto) {
    const user = await this.validateUser(dto.email, dto.password);

    const payload: JwtPayload = {
      id: user.id as number,
      email: dto.email,
    };

    const token = this.jwtService.sign(payload);

    await user.update({ token });

    return user.reload();
  }

  async validatePassword(password: string, userPassword: string): Promise<boolean> {
    if (!password || !userPassword) {
      return false;
    }
    
    try {
      return await bcrypt.compare(password, userPassword);
    } catch (error) {
      console.error('Password validation error:', error.message);
      return false;
    }
  }
}
