import { IsInt, IsNumber } from 'class-validator';

export class PostSavePortfolioBody {
  @IsInt()
  crypto_id: number;

  @IsNumber()
  price: number;

  @IsNumber()
  amount: number;
}

export class PortfolioGroupByCryptoId {
  amount: number;
  total_price: number;
  crypto_id: number;
}

export class PortfolioGroupByCryptoIdWithDetail extends PortfolioGroupByCryptoId {
  name: string;
  symbol: string;
  logo: string;
  now_price: number;
  profit: number;
}
