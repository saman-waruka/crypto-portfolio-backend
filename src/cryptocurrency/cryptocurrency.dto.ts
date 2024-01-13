import { Transform } from 'class-transformer';
import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class Quote {
  price: number;
  volume_24h: number;
  volume_change_24h: number;
  percent_change_1h: number;
  percent_change_24h: number;
  percent_change_7d: number;
  market_cap: number;
  market_cap_dominance: number;
  fully_diluted_market_cap: number;
  last_updated: string;
}

export class CryptocurrencyQuote {
  'THB': Quote;
}

export class CryptocurrencyResponse {
  id: number;
  name: string;
  symbol: string;
  slug: string;
  num_market_pairs: number;
  date_added: string;
  tags: string[];
  max_supply: number | null;
  circulating_supply: number;
  total_supply: number;
  infinite_supply: boolean;
  platform: null;
  cmc_rank: number;
  self_reported_circulating_supply: null;
  self_reported_market_cap: null;
  tvl_ratio: null;
  last_updated: string;
  quote: CryptocurrencyQuote;
}

export class ResponseStatus {
  timestamp: string;
  error_code: number;
  error_message: string;
  elapsed: number;
  credit_count: number;
}

export class CryptocurrencyMetadataDetail {
  id: number;
  name: string;
  symbol: string;
  category: string;
  description: string;
  slug: string;
  logo: string;
  subreddit: string;
  notice: string;
  tags: string[];
  'tag-names': string[];
  'tag-groups': string[];
  urls: {
    website: string[];
    twitter: string[];
    message_board: string[];
    chat: string[];
    facebook: string[];
    explorer: string[];
    reddit: string[];
    technical_doc: string[];
    source_code: string[];
    announcement: string[];
  };
  platform: null;
  date_added: string;
  twitter_username: string;
  is_hidden: boolean;
  date_launched: string; // "2010-07-13T00:00:00.000Z"
  contract_address: string[];
  self_reported_circulating_supply: null;
  self_reported_tags: null;
  self_reported_market_cap: null;
  infinite_supply: boolean;
}

export class CryptocurrencyMetadata {
  [key: string]: CryptocurrencyMetadataDetail;
}

export class GetListCryptocurrencyResponse {
  data: CryptocurrencyResponse[];
  status: ResponseStatus;
}

export class GetCryptocurrencyMetadataResponse {
  status: ResponseStatus;
  data: CryptocurrencyMetadata;
}

export class GetListCryptocurrencyQueryParams {
  @IsInt()
  @IsOptional()
  @Transform((params) => Number(params.value))
  limit?: number;
}

export class PostFetchCryptocurrencyBody {
  @IsInt()
  @IsNotEmpty()
  limit: number;

  @IsString()
  @IsNotEmpty()
  sort: string;
}
