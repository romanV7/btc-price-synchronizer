import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class BtcPrice {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  timestamp: Date;

  @Column()
  price: number;
}
