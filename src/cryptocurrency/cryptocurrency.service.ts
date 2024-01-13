import { HttpService } from '@nestjs/axios';
import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';
import {
  CryptocurrencyMetadata,
  CryptocurrencyResponse,
  GetCryptocurrencyMetadataResponse,
  GetListCryptocurrencyResponse,
} from './cryptocurrency.dto';
import { In, Repository } from 'typeorm';
import { Cryptocurrency } from './entities/cryptocurrency.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class CryptocurrencyService {
  private readonly logger = new Logger(CryptocurrencyService.name);

  constructor(
    private readonly httpService: HttpService,
    @InjectRepository(Cryptocurrency)
    private readonly cryptocurrencyRepository: Repository<Cryptocurrency>,
  ) {
    this.initialFirstTime();
  }

  async fetchAndStore(limit = 100, sort = 'market_cap') {
    const cryptos = await this.fetchData(limit, sort);
    await this.storeData(cryptos);
    return cryptos;
  }

  async fetchData(limit = 100, sort = 'market_cap'): Promise<Cryptocurrency[]> {
    const cryptoList = await this.listLatest(limit, sort);
    const ids = cryptoList.map((crypto) => crypto.id).join(',');
    const cryptoMetadata = await this.getCryptoMetadata(ids);
    const cryptos: Cryptocurrency[] = [];

    for (const cryptoDetail of cryptoList) {
      const { id, name, symbol, slug, quote, last_updated } = cryptoDetail;
      const metadata = cryptoMetadata[id];

      cryptos.push({
        crypto_id: id,
        name,
        symbol,
        slug,
        price: quote['THB'].price,
        market_cap: quote['THB'].market_cap,
        logo: metadata.logo,
        last_updated: new Date(last_updated),
      });
    }

    return cryptos;
  }

  async storeData(values: Cryptocurrency[]) {
    return this.cryptocurrencyRepository
      .createQueryBuilder()
      .insert()
      .into(Cryptocurrency)
      .values(values)
      .execute();
  }

  async listLatest(
    limit = 100,
    sort = 'market_cap',
  ): Promise<CryptocurrencyResponse[]> {
    const result = await lastValueFrom(
      this.httpService.get<GetListCryptocurrencyResponse>(
        '/v1/cryptocurrency/listings/latest',
        {
          params: {
            limit,
            sort,
            convert: 'THB',
          },
        },
      ),
    );

    const resultDataObject = result.data;
    return resultDataObject.data;
  }

  async getCryptoMetadata(id: string): Promise<CryptocurrencyMetadata> {
    if (!id) {
      throw new BadRequestException('Cannot get crypto data without id or ids');
    }

    const result = await lastValueFrom(
      this.httpService.get<GetCryptocurrencyMetadataResponse>(
        '/v2/cryptocurrency/info',
        {
          params: {
            id,
          },
        },
      ),
    );

    const resultDataObject = result.data;
    return resultDataObject.data;
  }

  async getListLatestFromDatabase(limit = 100) {
    return this.cryptocurrencyRepository
      .createQueryBuilder('cryptocurrency')
      .orderBy('cryptocurrency.id', 'DESC')
      .limit(limit)
      .getMany();
  }

  async getListByCryptoIds(ids: number[]): Promise<Cryptocurrency[]> {
    return this.cryptocurrencyRepository
      .createQueryBuilder('cryptocurrency')
      .orderBy('cryptocurrency.created_at', 'DESC')
      .where({ crypto_id: In(ids) })
      .getMany();
  }

  private async initialFirstTime() {
    const existsDatas = await this.getListLatestFromDatabase();
    if (!existsDatas.length) {
      await this.fetchAndStore();
      this.logger.log('fetchAndStore cryptocurrency ');
      return;
    }
    this.logger.log('skip fetchAndStore cryptocurrency ');
    return;
  }
}
