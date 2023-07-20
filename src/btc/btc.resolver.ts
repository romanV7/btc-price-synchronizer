import { BtcService } from './btc.service';
import { Resolver, Query } from '@nestjs/graphql';
import { BtcPrice } from './btc-price.entity';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';

@Resolver()
@UseGuards(GqlAuthGuard) // Use the GqlAuthGuard for GraphQL API authentication
export class BtcResolver {
  constructor(private readonly btcService: BtcService) {}

  @Query(() => [BtcPrice])
  async btcPriceHistory(): Promise<BtcPrice[]> {
    return this.btcService.getBtcPriceHistory();
  }

  @Query(() => BtcPrice)
  async currentBtcPrice(): Promise<BtcPrice> {
    return this.btcService.getCurrentBtcPrice();
  }
}
