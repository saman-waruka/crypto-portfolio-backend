import { Module } from '@nestjs/common';
import { CryptocurrencyService } from './cryptocurrency.service';
import { CryptocurrencyController } from './cryptocurrency.controller';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cryptocurrency } from './entities/cryptocurrency.entity';

@Module({
  imports: [
    HttpModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        baseURL: configService.get('coinMarketProvider.baseUrl'),
        headers: {
          'X-CMC_PRO_API_KEY': configService.get('coinMarketProvider.apiKey'),
        },
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([Cryptocurrency]),
  ],
  providers: [CryptocurrencyService],
  controllers: [CryptocurrencyController],
  exports: [CryptocurrencyService],
})
export class CryptocurrencyModule {}
