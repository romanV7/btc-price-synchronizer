import { Test, TestingModule } from '@nestjs/testing';
import { BtcResolver } from './btc.resolver';
import { BtcService } from './btc.service';

describe('BtcResolver', () => {
  let btcResolver: BtcResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BtcResolver,
        {
          provide: BtcService,
          useValue: {
            getBtcPriceHistory: jest
              .fn()
              .mockResolvedValue([{ timestamp: new Date(), price: 45000 }]),
            getCurrentBtcPrice: jest
              .fn()
              .mockResolvedValue({ timestamp: new Date(), price: 45000 }),
          },
        },
      ],
    }).compile();

    btcResolver = module.get<BtcResolver>(BtcResolver);
  });

  it('should be defined', () => {
    expect(btcResolver).toBeDefined();
  });

  it('should get BTC price history', async () => {
    const priceHistory = await btcResolver.btcPriceHistory();
    expect(priceHistory).toEqual([
      { timestamp: expect.any(Date), price: 45000 },
    ]);
  });

  it('should get current BTC price', async () => {
    const currentPrice = await btcResolver.currentBtcPrice();
    expect(currentPrice).toEqual({ timestamp: expect.any(Date), price: 45000 });
  });
});
