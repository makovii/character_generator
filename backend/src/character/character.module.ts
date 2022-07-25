import { Module, forwardRef } from '@nestjs/common';
import { CharacterService } from './character.service';
import { CharacterController } from './character.controller';
import { Character } from './character.model';
import { SequelizeModule } from '@nestjs/sequelize';
import { AuthModule } from '../auth/auth.module';
import { ClothesModule } from '../clothes/clothes.module';
import { SubjectModule } from '../subject/subject.module';
import { SkillModule } from '../skill/skill.module';

@Module({
  providers: [CharacterService],
  controllers: [CharacterController],
  imports: [
    SequelizeModule.forFeature([Character]),
    forwardRef(() => AuthModule),
    forwardRef(() => ClothesModule),
    forwardRef(() => SubjectModule),
    forwardRef(() => SkillModule),
  ],
  exports: [CharacterService],
})
export class CharacterModule {}
