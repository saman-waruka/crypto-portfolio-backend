import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { PortfolioService } from './portfolio.service';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { User } from 'src/user/entities/user.entity';
import {
  PortfolioGroupByCryptoIdWithDetail,
  PostSavePortfolioBody,
} from './portfolio.dto';
import { CryptocurrencyService } from 'src/cryptocurrency/cryptocurrency.service';

@Controller('portfolio')
@UseGuards(JwtAuthGuard)
export class PortfolioController {
  constructor(
    private readonly portfolioService: PortfolioService,
    private readonly cryptocurrencyService: CryptocurrencyService,
  ) {}

  @Post()
  async save(@CurrentUser() user: User, @Body() data: PostSavePortfolioBody) {
    const portfolio = await this.portfolioService.create({ ...data, user });
    return { success: true, portfolio };
  }

  @Get()
  async getAll(
    @CurrentUser() user: User,
  ): Promise<PortfolioGroupByCryptoIdWithDetail[]> {
    const portfolioList =
      await this.portfolioService.getAllByUserIdGroupByCrypto(user.id);

    const cryptoList = await this.cryptocurrencyService.getListByCryptoIds(
      portfolioList.map((portfolio) => portfolio.crypto_id),
    );

    const result: PortfolioGroupByCryptoIdWithDetail[] = [];

    for (const portfolio of portfolioList) {
      const crypto = cryptoList.find(
        (crypto) => crypto.crypto_id === portfolio.crypto_id,
      );

      result.push({
        ...portfolio,
        name: crypto.name,
        symbol: crypto.symbol,
        logo: crypto.logo,
        now_price: crypto.price,
        profit: crypto.price * portfolio.amount - portfolio.total_price,
      });
    }

    return result;
  }

  @Delete(':id')
  async delete(@CurrentUser() user: User, @Param('id') id: number) {
    await this.portfolioService.delete(id, user);
    return { success: true };
  }
}
