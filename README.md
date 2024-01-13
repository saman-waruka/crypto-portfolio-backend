
# Crypto Portfolio Backend

## How to start this project (locally)
1. Install Dependencies
```
npm install
```
2. start Postgres database using docker compose

```
docker compose -f docker-compose-postgres.yml up -d 
```
3. Prepare CoinMarketCap API key
- Goto https://coinmarketcap.com/ And Sign up
- Login goto https://pro.coinmarketcap.com/account
- Get your API key from Overview menu
- This will use for fill in COIN_MARKET_API_KEY inside .env file 

4. Prepare environment file
```
cp .env.example .env
```
- Fill PORT for set service serve
- Fill your database secret (in this example is good and can use for run locally)
- Fill your JWT_SECRET for use in JWT authentication
- Fill JWT_EXPIRES_IN for set How long JWT token will expires  expiresIn: expressed in seconds or a string describing a time span [vercel/ms](https://github.com/vercel/ms)
- Fill your COIN_MARKET_BASE_URL (look at the document for get API Domain from [document](https://coinmarketcap.com/api/documentation/v1/#section/Quick-Start-Guide))
- Fill your COIN_MARKET_API_KEY

5. Start local (develop mode)
```
npm run start:dev
```

6. Start Frontend from this repository  [crypto-portfolio-frontend](https://github.com/saman-waruka/crypto-portfolio-frontend)

---
`Note:` To fetch new cryptocurrency detail please make request with method `POST` to api endpoint  `/cryptocurrency/fetch-and-store` and attatch `user JWT token` in headers name `Authorization` and value is `Bearer your-jwt-token`