import { Module, forwardRef } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { CharacterSkill } from './character-skill.model';
import { Skill } from './skill.model';
import { SkillService } from './skill.service';
import { SkillController } from './skill.controller';
import { AuthModule } from '../auth/auth.module';
import { CharacterModule } from '../character/character.module';

@Module({
  providers: [SkillService],
  imports: [
    SequelizeModule.forFeature([Skill, CharacterSkill]),
    forwardRef(() => AuthModule),
    forwardRef(() => CharacterModule),
  ],
  controllers: [SkillController],
  exports: [SkillService],
})
export class SkillModule {}
