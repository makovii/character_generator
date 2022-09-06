import { Module, forwardRef } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { CharacterClothes } from './character-clothes.model';
import { Clothes } from './clothes.model';
import { ClothesService } from './clothes.service';
import { ClothesController } from './clothes.controller';
import { AuthModule } from '../auth/auth.module';
import { CharacterModule } from '../character/character.module';

@Module({
  providers: [ClothesService],
  imports: [
    SequelizeModule.forFeature([Clothes, CharacterClothes]),
    forwardRef(() => AuthModule),
    forwardRef(() => CharacterModule),
  ],
  controllers: [ClothesController],
  exports: [ClothesService],
})
export class ClothesModule {}
