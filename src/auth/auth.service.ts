import { Injectable } from '@nestjs/common';
import { createHmac, randomBytes } from 'crypto';

@Injectable()
export class AuthService {
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
}
