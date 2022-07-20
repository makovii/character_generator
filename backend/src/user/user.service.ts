import { forwardRef, HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/sequelize';
import { RequestdWithUser } from 'src/types/request-type';
import { Character } from 'src/character/character.model';
import { CharacterService } from 'src/character/character.service';
import { ROLE } from 'src/constants';
import { FAILED, NO_SUCH_CHARACTER, SUCCESS, WRONG_CODE } from 'src/response.messages';
import { Candidate } from './candidate.model';
import { CandidateDto } from './dto/candidate.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './user.model';
import { AuthService } from 'src/auth/auth.service';
import { ClothesService } from 'src/clothes/clothes.service';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User) private userRepository: typeof User,
    @InjectModel(Candidate) private candidateRepository: typeof Candidate,
    private jwtService: JwtService,
    private characterService: CharacterService,
    @Inject(forwardRef(() => AuthService))
    private authService: AuthService,
    private clothesService: ClothesService
    ) {}

  async createUserFromEmail(token: string) {
    const user = this.jwtService.verify(token);
    const role = ROLE.PLAYER;
    const condidate = { ...user, roleId: role, ban: false, banReason: '' };
    return await this.userRepository.create(condidate);
  }

  async createUserFromSms(dto: CandidateDto) {
    const { code, password, name, phone } = await this.candidateRepository.findOne({ where: {phone: dto.phone }});
    if (code === dto.code) {
      const role = ROLE.PLAYER;
      const user = { name, password, phone, roleId: role, ban: false, banReason: '' };
      return await this.userRepository.create(user);
    } else return new HttpException(WRONG_CODE, HttpStatus.BAD_REQUEST);

  }

  async getUserByEmail(email: string) {
    return await this.userRepository.findOne({ where: { email }, include: {all: true} });
  }

  async getUserByPhone(phone: string) {
    return await this.userRepository.findOne({ where: { phone }, include: {all: true} });
  }

  async createCandidate(dto: CandidateDto) {
    return await this.candidateRepository.create(dto);
  }

  async getUserById(id: number) {
    const user = await this.userRepository.findOne({ raw: true, where: { id }, include: { all: true }});
    const {tokenId, createdAt} = await this.authService.getLastJwtDateByUserId(id);
    const lastLogin = createdAt;
    const result = Object.assign(user, {lastLogin, tokenId});
    return result;
  }

  async insertOpenedClothes(userId: number, clothesId: number[]) {
    const insertedToCharacter = await this.characterService.insertOpenedClothes(userId, clothesId);
    if(insertedToCharacter) return SUCCESS
    else return FAILED
  }

  async insertOpenedSubjects(userId: number, subjectsId: number[]) {
    const insertedToCharacter = await this.characterService.insertOpenedSubjects(userId, subjectsId);
    if(insertedToCharacter) return SUCCESS
    else return FAILED
  }

  async insertOpenedSkills(userId: number, skillsId: number[]) {
    const insertedToCharacter = await this.characterService.insertOpenedSkills(userId, skillsId);
    if(insertedToCharacter) return SUCCESS
    else return FAILED
  }
}
