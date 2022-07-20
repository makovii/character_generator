import {
  Model,
  Table,
  Column,
  DataType,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { Role } from '../role/role.model';
import { PRIMARY_KEY } from '../constants';
import { Character } from 'src/character/character.model';

interface CandidateCreate {
  name: string;
  email?: string;
  password: string;
  phone?: string;
  code?: string
}

@Table({ tableName: 'candidate' })
export class Candidate extends Model<CandidateCreate> {
  @Column(PRIMARY_KEY)
  id: number;

  @Column({ type: DataType.STRING, allowNull: false })
  name: string;

  @Column({ type: DataType.STRING})
  email: string;

  @Column({ type: DataType.STRING, allowNull: false })
  password: string;

  @Column({ type: DataType.STRING })
  phone: string;

  @Column({ type: DataType.STRING })
  code: string;

}
