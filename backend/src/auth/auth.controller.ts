import { Body, Controller, Get, Param, Patch, Post, UseGuards, UsePipes } from '@nestjs/common';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { AuthService } from './auth.service';
import { ValidationPipe } from '../pipe/validation.pipe';
import { UserService } from 'src/user/user.service';
import { CandidateDto } from 'src/user/dto/candidate.dto';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService, private userService: UserService) {}

  @UsePipes(ValidationPipe)
  @Get('/login')
  login(@Body() userDto: CreateUserDto) {
    return this.authService.login(userDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/logout')
  logout(@Body() userDto: CreateUserDto) {
    return this.authService.logout(userDto);
  }

  @UsePipes(ValidationPipe)
  @Post('/registration')
  registration(@Body() userDto: CreateUserDto) {
    return this.authService.registration(userDto);
  }

  @Get('/confirmEmail/:token')
  async confirmEmail(@Param('token') token: string) {
    return this.userService.createUserFromEmail(token);
  }

  @Post('/confirmPhone')
  async confirmPhone (@Body() candidate: CandidateDto) {
    return this.userService.createUserFromSms(candidate);
  }
}
