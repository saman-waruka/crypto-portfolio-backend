interface CommonConfig {
  port: number;
}

export default (): CommonConfig => {
  return {
    port: parseInt(process.env.PORT, 10) || 3000,
  };
};
