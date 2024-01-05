import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user.interface';

@Entity('users')
export class UserEntity implements User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column({ default: '' })
  name: string;

  @Column({ default: '' })
  password: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
}
