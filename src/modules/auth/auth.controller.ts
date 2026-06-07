import { Body, Controller, Get, Post } from '@nestjs/common';

import { AuthService } from './auth.service';
import { RegisterDto } from './dtos/register.dto';
import { LoginDto } from './dtos/login.dto';
import { GetSession, SetSession } from 'src/decorators/session';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('session')
  getSession(@GetSession() session: Record<string, unknown>) {
    return session;
  }

  @Post('register')
  async register(
    @Body() body: RegisterDto,
    @SetSession() setSession: (key: string, value: unknown) => void,
  ) {
    const response = await this.authService.register(body);
    setSession('user_id', response.user._id);
    return response;
  }

  @Post('login')
  async login(
    @Body() body: LoginDto,
    @SetSession() setSession: (key: string, value: unknown) => void,
    @GetSession() session: Record<string, unknown>,
  ) {
    const response = await this.authService.login(body);
    setSession('user_id', response.user._id.toString());
    console.log({ session });
    return response;
  }
}
