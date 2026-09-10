import { Test, TestingModule } from '@nestjs/testing';
import { EstrategiasEnsenanzaService } from './estrategias-ensenanza.service';

describe('EstrategiasEnsenanzaService', () => {
  let service: EstrategiasEnsenanzaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EstrategiasEnsenanzaService],
    }).compile();

    service = module.get<EstrategiasEnsenanzaService>(EstrategiasEnsenanzaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
