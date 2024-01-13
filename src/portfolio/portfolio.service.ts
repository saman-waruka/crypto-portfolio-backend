import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Portfolio } from './entities/portfolio.entity';
import { DeleteResult, Repository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { PortfolioGroupByCryptoId } from './portfolio.dto';

@Injectable()
export class PortfolioService {
  constructor(
    @InjectRepository(Portfolio)
    private readonly portfolioRepository: Repository<Portfolio>,
  ) {}

  async create(data: Portfolio): Promise<Portfolio> {
    return this.portfolioRepository.save(data);
  }

  async getAllByUserId(userId: number): Promise<Portfolio[]> {
    return this.portfolioRepository
      .createQueryBuilder()
      .where({ user: userId })
      .getMany();
  }

  async getAllByUserIdGroupByCrypto(
    userId: number,
  ): Promise<PortfolioGroupByCryptoId[]> {
    return this.portfolioRepository
      .createQueryBuilder('portfolio')
      .select('SUM(portfolio.amount)', 'amount')
      .addSelect('SUM(portfolio.amount * portfolio.price)', 'total_price')
      .addSelect(
        'FIRST_VALUE(portfolio.crypto_id) OVER(PARTITION BY portfolio.crypto_id)',
        'crypto_id',
      )
      .groupBy('portfolio.crypto_id')
      .where({ user: userId })
      .orderBy('amount', 'DESC')
      .execute();
  }

  async delete(id: number, user: User): Promise<DeleteResult> {
    return this.portfolioRepository.delete({ id, user });
  }
}
