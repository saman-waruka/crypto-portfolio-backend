import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('cryptocurrency')
export class Cryptocurrency {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column()
  crypto_id: number;

  @Column()
  name: string;

  @Column()
  symbol: string;

  @Column()
  slug: string;

  @Column()
  logo: string;

  @Column({ type: 'double precision' })
  price: number;

  @Column({ type: 'double precision' })
  market_cap: number;

  @Column({ type: 'timestamp' })
  last_updated: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at?: Date;
}
