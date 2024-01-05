import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { SignUpDto } from 'src/auth/auth.dto';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly authService: AuthService,
  ) {}

  async create(userInfo: SignUpDto): Promise<User> {
    const hash = this.authService.hashPassword(userInfo.password);
    return await this.userRepository.save({ ...userInfo, password: hash });
  }

  async getByEmail(
    email: string,
    selectPassword = false,
  ): Promise<User | null> {
    const query = this.userRepository
      .createQueryBuilder('user')
      .where({ email });

    if (selectPassword) {
      query.addSelect('user.password');
    }

    return query.getOne();
  }
}
