export class JwtPayload {
  sub: number;
  user: {
    email: string;
    name: string;
  };
}
