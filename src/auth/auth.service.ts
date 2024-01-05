import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { createHmac, randomBytes } from 'crypto';
import { User } from 'src/user/entities/user.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  hashPassword(password: string): string {
    const salt = randomBytes(16).toString('hex');
    const hash = createHmac('sha3-512', salt).update(password).digest('hex');
    return `${salt}:${hash}`;
  }

  checkPassword(password: string, hash: string): boolean {
    const [salt, key] = hash.split(':');
    const hashPassword = createHmac('sha3-512', salt)
      .update(password)
      .digest('hex');
    return hashPassword == key;
  }

  getSignInToken(user: User): string {
    delete user.password;
    const payload = {
      sub: user.id,
      user: {
        email: user.email,
        name: user.name,
      },
    };
    return this.jwtService.sign(payload, {
      secret: this.configService.get('auth.jwtSecretKey'),
      expiresIn: this.configService.get('auth.jwtExpirationTime'),
    });
  }
}
