import { Test, TestingModule } from '@nestjs/testing';
import { PlanificacionesController } from './planificaciones.controller';
import { PlanificacionesService } from './planificaciones.service';

describe('PlanificacionesController', () => {
  let controller: PlanificacionesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PlanificacionesController],
      providers: [PlanificacionesService],
    }).compile();

    controller = module.get<PlanificacionesController>(PlanificacionesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
