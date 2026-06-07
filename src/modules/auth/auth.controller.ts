import {
  Body,
  Controller,
  Get,
  Post,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';

import { AuthService } from './auth.service';
import { RegisterDto } from './dtos/register.dto';
import { LoginDto } from './dtos/login.dto';
import { GetSession, SetSession, LogoutSession } from 'src/decorators/session';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('session')
  async getSession(@GetSession('user_id') userId: string) {
    if (!userId) {
      return {
        is_logged_in: false,
      };
    }

    return await this.authService.getSession(userId);
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(@LogoutSession() logout: () => Promise<void>) {
    await logout();
    return { message: 'Logout successful' };
  }

  @Post('register')
  async register(
    @Body() body: RegisterDto,
    @SetSession() setSession: (key: string, value: unknown) => Promise<void>,
  ) {
    const response = await this.authService.register(body);
    await setSession('user_id', response.user._id.toString());
    return response;
  }

  @Post('login')
  async login(
    @Body() body: LoginDto,
    @SetSession() setSession: (key: string, value: unknown) => Promise<void>,
  ) {
    const response = await this.authService.login(body);
    await setSession('user_id', response.user._id.toString());
    return response;
  }
}
