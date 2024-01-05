interface AuthConfig {
  jwtSecretKey: string;
  jwtExpirationTime: string;
}

interface CommonConfig {
  port: number;
  auth: AuthConfig;
}

export default (): CommonConfig => {
  return {
    port: parseInt(process.env.PORT, 10) || 3000,
    auth: {
      jwtSecretKey: process.env.JWT_SECRET,
      jwtExpirationTime: process.env.JWT_EXPIRES_IN,
    },
  };
};
