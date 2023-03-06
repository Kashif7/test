import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { compare, hash } from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string): Promise<User | null> {
    const user = await this.userService.user({
      email,
    });

    console.log('USER', user);

    const isPasswordCorrect = await compare(pass, user.password);

    if (isPasswordCorrect) {
      return user;
    }

    return null;
  }

  async login(user: User): Promise<{
    access_token: string;
  }> {
    const payload = {
      email: user.email,
      sub: user.id,
    };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async register(email: string, password: string): Promise<User> {
    const passwordHash = await hash(password, 10);

    const newUser = await this.userService.createUser({
      email,
      password: passwordHash,
    });

    return newUser;
  }
}
