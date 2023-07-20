import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BtcResolver } from './btc.resolver';
import { BtcService } from './btc.service';
import { BtcPrice } from './btc-price.entity';

@Module({
  imports: [TypeOrmModule.forFeature([BtcPrice])],
  providers: [BtcResolver, BtcService],
})
export class BtcModule {}
