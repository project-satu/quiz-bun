import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  errorResponse,
  successResponse,
} from '@/utils/helpers/response.helper';
import { Request } from 'express';
import { ApiBearerAuth } from '@nestjs/swagger';
import { LoginDto, RegisterDto } from './dto/auth.dto';
import { LocalGuard } from './guards/local.guard';
import { JwtAuthGuard } from './guards/jwt.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    try {
      const data = await this.authService.registerUser(registerDto);

      return successResponse({ data });
    } catch (error) {
      return errorResponse(error.message, error.status);
    }
  }

  @Post('login')
  @UseGuards(LocalGuard)
  async login(@Req() req: Request, @Body() loginDto: LoginDto) {
    try {
      return successResponse({ data: req.user });
    } catch (error) {
      console.log(error);
      return errorResponse(error.message, error.status);
    }
  }

  @ApiBearerAuth('access-token')
  @Get('me')
  @UseGuards(JwtAuthGuard)
  async me(@Req() req: Request) {
    try {
      return successResponse({
        data: {
          user: req.user,
        },
      });
    } catch (error) {
      return errorResponse(error.message, error.status);
    }
  }
}
