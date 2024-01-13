import { Column, Entity } from 'typeorm';

@Entity('crypto_metadata')
export class CryptoMetadata {
  @Column({ unique: true })
  id: number;

  @Column()
  name: string;

  @Column()
  symbol: string;

  @Column()
  logo: string;
}
