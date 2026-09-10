import { Test, TestingModule } from '@nestjs/testing';
import { PlanificacionDetallesController } from './planificacion-detalles.controller';
import { PlanificacionDetallesService } from './planificacion-detalles.service';

describe('PlanificacionDetallesController', () => {
  let controller: PlanificacionDetallesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PlanificacionDetallesController],
      providers: [PlanificacionDetallesService],
    }).compile();

    controller = module.get<PlanificacionDetallesController>(PlanificacionDetallesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
