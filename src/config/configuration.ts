interface AuthConfig {
  jwtSecretKey: string;
  jwtExpirationTime: string;
}

interface CoinMarketConfig {
  baseUrl: string;
  apiKey: string;
}

interface CommonConfig {
  port: number;
  auth: AuthConfig;
  coinMarketProvider: CoinMarketConfig;
}

export default (): CommonConfig => {
  return {
    port: parseInt(process.env.PORT, 10) || 3000,
    auth: {
      jwtSecretKey: process.env.JWT_SECRET,
      jwtExpirationTime: process.env.JWT_EXPIRES_IN,
    },
    coinMarketProvider: {
      baseUrl: process.env.COIN_MARKET_BASE_URL,
      apiKey: process.env.COIN_MARKET_API_KEY,
    },
  };
};
