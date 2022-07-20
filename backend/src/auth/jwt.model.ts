import {
  Model,
  Table,
  Column,
  DataType,
  BelongsTo,
  ForeignKey,
} from 'sequelize-typescript';
import { User } from 'src/user/user.model';
import { PRIMARY_KEY } from '../constants';


@Table({ tableName: 'jwt' })
export class JwtDB extends Model<JwtDB> {
  @Column(PRIMARY_KEY)
  id: number;

  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  }) 
  tokenId: string;

  @Column({ type: DataType.INTEGER })
  @ForeignKey(() => User)
  userId: number;

  @Column({ type: DataType.STRING(400) })
  jwt: string;

  @Column({ type: DataType.BOOLEAN })
  isActive: boolean;

}
