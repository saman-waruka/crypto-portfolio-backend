import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';

@Controller('cryptocurrency')
@UseGuards(JwtAuthGuard)
export class CryptocurrencyController {
  @Get()
  async getListCryptocurrency() {
    return {};
  }
}
