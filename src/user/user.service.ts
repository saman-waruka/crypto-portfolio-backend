import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { Repository } from 'typeorm';
import { SignUpDto } from 'src/auth/auth.dto';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly authService: AuthService,
  ) {}

  async create(userInfo: SignUpDto): Promise<UserEntity> {
    const hash = this.authService.hashPassword(userInfo.password);
    return await this.userRepository.save({ ...userInfo, password: hash });
  }

  async getByEmail(email: string): Promise<UserEntity | null> {
    return this.userRepository.findOneBy({ email });
  }
}
