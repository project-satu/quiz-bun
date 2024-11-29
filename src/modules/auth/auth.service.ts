import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginDto, RegisterDto } from './dto/auth.dto';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser({ email, password }: LoginDto) {
    const user = await this.userService.findByEmail(email, true);

    if (
      user &&
      (await this.userService.validatePassword(password, user.password))
    ) {
      const dataToken = this.jwtService.sign({
        id: user.id,
        uuid: user.uuid,
        email: user.email,
        name: user.name,
        phone: user.phone,
        role: {
          id: user.role.id,
          uuid: user.role.uuid,
          name: user.role.name,
          value: user.role.value,
        },
      });

      return {
        user: {
          email: user.email,
          role: user.roleId,
        },
        expired_at: this.jwtService.decode(dataToken).exp,
        token: dataToken,
      };
    }

    return null;
  }

  async registerUser(registerDto: RegisterDto) {
    const user = await this.userService.create(registerDto);

    return user;
  }
}
