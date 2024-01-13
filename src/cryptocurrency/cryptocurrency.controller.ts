import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import {
  GetListCryptocurrencyQueryParams,
  PostFetchCryptocurrencyBody,
} from './cryptocurrency.dto';
import { CryptocurrencyService } from './cryptocurrency.service';
import { Cryptocurrency } from './entities/cryptocurrency.entity';

@Controller('cryptocurrency')
@UseGuards(JwtAuthGuard)
export class CryptocurrencyController {
  constructor(private readonly cryptocurrencyService: CryptocurrencyService) {}

  @Get()
  async getListCryptocurrency(
    @Query() params: GetListCryptocurrencyQueryParams,
  ): Promise<Cryptocurrency[]> {
    const cryptoDataList =
      await this.cryptocurrencyService.getListLatestFromDatabase(params.limit);
    return cryptoDataList.sort((a, b) => b.market_cap - a.market_cap);
  }

  @Post('fetch-and-store')
  async fetchAndStore(@Body() body: PostFetchCryptocurrencyBody) {
    const cryptoDataList = await this.cryptocurrencyService.fetchAndStore(
      body.limit,
      body.sort,
    );
    return cryptoDataList;
  }
}
