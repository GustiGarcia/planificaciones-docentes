import { Test, TestingModule } from '@nestjs/testing';
import { PlanificacionDetallesService } from './planificacion-detalles.service';

describe('PlanificacionDetallesService', () => {
  let service: PlanificacionDetallesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PlanificacionDetallesService],
    }).compile();

    service = module.get<PlanificacionDetallesService>(PlanificacionDetallesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
