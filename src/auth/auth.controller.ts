import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { User } from '@prisma/client';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('/login')
  async login(@Request() req: { user: User }) {
    console.log('COMES');
    const response = this.authService.login(req.user);

    return response;
  }

  @Post('/register')
  async register(@Body() req: { email: string; password: string }) {
    console.log('request', req);
    return this.authService.register(req.email, req.password);
  }
}
