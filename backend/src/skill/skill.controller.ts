import { Controller, Get, Post, Patch, Delete, UseGuards, Param, Body } from '@nestjs/common';
import { Role } from 'src/auth/checkRole.decorator';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ROLE } from 'src/constants';
import { CreateSkill } from './dto/create-skill.dto';
import { SkillService } from './skill.service';

@Controller('skill')
export class SkillController {
  constructor(private skillService: SkillService) {}
  
  @Get('')
  @Role(ROLE[ROLE.ADMIN])
  @UseGuards(JwtAuthGuard)
  async getAllSkills() {
    return await this.skillService.getAllSkills()
  }

  @Post('')  
  @Role(ROLE[ROLE.ADMIN])
  @UseGuards(JwtAuthGuard)
  async createSkill(@Body() dto: CreateSkill) {
    return this.skillService.createSkill(dto)
  }
  
  @Patch('/:id')
  @Role(ROLE[ROLE.ADMIN])
  @UseGuards(JwtAuthGuard)
  async updateSkill(@Param('id') id: number, @Body() dto: CreateSkill) {
    return this.skillService.updateSkill(id, dto)
  }
  
  @Delete('/:id')  
  @Role(ROLE[ROLE.ADMIN])
  @UseGuards(JwtAuthGuard)
  async deleteSkill(@Param('id') id: number) {
    return this.skillService.deleteSkill(id)
  }

  @Delete('disable/:id')  
  @Role(ROLE[ROLE.ADMIN])
  @UseGuards(JwtAuthGuard)
  async disableClothes(@Param('id') id: string) {
    return this.skillService.disableSkill(Number(id))
  }
}
