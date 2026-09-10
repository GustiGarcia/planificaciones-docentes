import { Test, TestingModule } from '@nestjs/testing';
import { EstrategiasEnsenanzaController } from './estrategias-ensenanza.controller';
import { EstrategiasEnsenanzaService } from './estrategias-ensenanza.service';

describe('EstrategiasEnsenanzaController', () => {
  let controller: EstrategiasEnsenanzaController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EstrategiasEnsenanzaController],
      providers: [EstrategiasEnsenanzaService],
    }).compile();

    controller = module.get<EstrategiasEnsenanzaController>(EstrategiasEnsenanzaController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
