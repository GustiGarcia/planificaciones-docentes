import { Test, TestingModule } from '@nestjs/testing';
import { MetodosEvaluacionController } from './metodos-evaluacion.controller';
import { MetodosEvaluacionService } from './metodos-evaluacion.service';

describe('MetodosEvaluacionController', () => {
  let controller: MetodosEvaluacionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MetodosEvaluacionController],
      providers: [MetodosEvaluacionService],
    }).compile();

    controller = module.get<MetodosEvaluacionController>(MetodosEvaluacionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
