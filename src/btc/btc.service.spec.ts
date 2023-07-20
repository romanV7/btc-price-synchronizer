import { Test, TestingModule } from '@nestjs/testing';
import { BtcService } from './btc.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BtcPrice } from './btc-price.entity';

import axios from 'axios';

// Mock the axios.get method to simulate API calls
jest.mock('axios');
const mockAxios = axios as jest.Mocked<typeof axios>;

// Mock BTC price data
const mockBtcPriceData = {
  price: 45000,
};

// Simulate the API response for fetching BTC price
mockAxios.get.mockResolvedValue({ data: mockBtcPriceData });

describe('BtcService', () => {
  let btcService: BtcService;
  let btcRepositoryMock: any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BtcService,
        {
          provide: getRepositoryToken(BtcPrice),
          useValue: {
            find: jest.fn(),
            save: jest.fn(),
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    btcService = module.get<BtcService>(BtcService);
    btcRepositoryMock = module.get(getRepositoryToken(BtcPrice));
  });

  it('should fetch BTC price', async () => {
    const btcPrice = await btcService.fetchBtcPrice();
    expect(btcPrice).toBeDefined();
    expect(btcPrice.timestamp).toBeInstanceOf(Date);
    expect(btcPrice.price).toBe(mockBtcPriceData.price);
  });

  it('should save BTC price to the database', async () => {
    const btcPrice = await btcService.fetchBtcPrice();
    const saveSpy = jest.spyOn(btcRepositoryMock, 'save');
    await btcService.updateBtcPrice();

    expect(saveSpy).toHaveBeenCalledWith(btcPrice);
  });

  it('should get BTC price history', async () => {
    const mockPriceHistory = [{ timestamp: new Date(), price: 45000 }];
    btcRepositoryMock.find.mockResolvedValue(mockPriceHistory);

    const priceHistory = await btcService.getBtcPriceHistory();
    expect(priceHistory).toEqual(mockPriceHistory);
  });

  it('should get current BTC price', async () => {
    const mockCurrentPrice = { timestamp: new Date(), price: 45000 };
    btcRepositoryMock.findOne.mockResolvedValue(mockCurrentPrice);

    const currentPrice = await btcService.getCurrentBtcPrice();
    expect(currentPrice).toEqual(mockCurrentPrice);
  });
});
