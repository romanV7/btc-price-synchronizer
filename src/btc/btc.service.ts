import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BtcPrice } from './btc-price.entity';
import axios from 'axios';

@Injectable()
export class BtcService {
  constructor(
    @InjectRepository(BtcPrice)
    private readonly btcPriceRepository: Repository<BtcPrice>,
  ) {}

  @Cron(CronExpression.EVERY_MINUTE)
  async updateBtcPrice(): Promise<void> {
    const btcPrice = await this.fetchBtcPrice();
    await this.saveBtcPriceToDatabase(btcPrice);
  }

  async fetchBtcPrice(): Promise<Partial<BtcPrice>> {
    try {
      const response = await axios.get(
        'https://api.binance.com/api/v3/ticker/price',
        {
          params: { symbol: 'BTCUSDT' },
        },
      );

      if (response.data && response.data.price) {
        return {
          timestamp: new Date(),
          price: parseFloat(response.data.price),
        };
      }

      throw new Error('Invalid response from Binance API');
    } catch (error) {
      throw new Error('Error fetching BTC price from Binance API');
    }
  }

  async saveBtcPriceToDatabase(price: Partial<BtcPrice>): Promise<void> {
    await this.btcPriceRepository.save(price);
  }

  async getBtcPriceHistory(): Promise<BtcPrice[]> {
    return this.btcPriceRepository.find();
  }

  async getCurrentBtcPrice(): Promise<BtcPrice> {
    return this.btcPriceRepository.findOne({ order: { timestamp: 'DESC' } });
  }
}
