import { Controller, Get, Req, UseGuards, Post, Body } from '@nestjs/common';
import { RequestdWithUser } from 'src/types/request-type';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Character } from 'src/character/character.model';
import { User } from './user.model';
import { UserService } from './user.service';
import { ROLE } from 'src/constants';
import { Role } from 'src/auth/checkRole.decorator';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  @Role(ROLE[ROLE.ADMIN])
  @UseGuards(JwtAuthGuard)
  getUserById(@Body() dto: { id: number }) {
    return this.userService.getUserById(dto.id);
  }

  @Post('insert/openedClothes')
  @Role(ROLE[ROLE.ADMIN])
  @UseGuards(JwtAuthGuard)
  insertOpenedClothes(@Body() dto: { id: number, clothesId: number[] }) {
    return this.userService.insertOpenedClothes(dto.id, dto.clothesId);
  }

  @Post('insert/openedSubjects')
  @Role(ROLE[ROLE.ADMIN])
  @UseGuards(JwtAuthGuard)
  insertOpenedSubjects(@Body() dto: { id: number, subjectsId: number[] }) {
    return this.userService.insertOpenedSubjects(dto.id, dto.subjectsId);
  }

  @Post('insert/openedSkills')
  @Role(ROLE[ROLE.ADMIN])
  @UseGuards(JwtAuthGuard)
  insertOpenedSkills(@Body() dto: { id: number, skillsId: number[] }) {
    return this.userService.insertOpenedSkills(dto.id, dto.skillsId);
  }
}
