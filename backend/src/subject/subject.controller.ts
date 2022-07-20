import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { Role } from 'src/auth/checkRole.decorator';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ROLE } from 'src/constants';
import { CreateSubject } from './dto/create-subject.dto';
import { SubjectService } from './subject.service';

@Controller('subject')
export class SubjectController {
  constructor(private subjectService: SubjectService) {}
  
  @Get('')
  @Role(ROLE[ROLE.ADMIN])
  @UseGuards(JwtAuthGuard)
  async getAllSubjects() {
    return await this.subjectService.getAllSubjects()
  }
  
  @Post('')  
  @Role(ROLE[ROLE.ADMIN])
  @UseGuards(JwtAuthGuard)
  async createSubject(@Body() dto: CreateSubject) {
    return this.subjectService.createSubject(dto)
  }
  
  @Patch('/:id')  
  @Role(ROLE[ROLE.ADMIN])
  @UseGuards(JwtAuthGuard)
  async updateSubject(@Param('id') id: number, @Body() dto: CreateSubject) {
    return this.subjectService.updateSubject(id, dto)
  }
  
  @Delete('/:id')  
  @Role(ROLE[ROLE.ADMIN])
  @UseGuards(JwtAuthGuard)
  async deleteSubject(@Param('id') id: number) {
    return this.subjectService.deleteSubject(id)
  }

  @Delete('disable/:id')  
  @Role(ROLE[ROLE.ADMIN])
  @UseGuards(JwtAuthGuard)
  async disableClothes(@Param('id') id: string) {
    return this.subjectService.disableSubject(Number(id))
  }
}
