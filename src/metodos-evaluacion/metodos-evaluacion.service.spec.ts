import { Test, TestingModule } from '@nestjs/testing';
import { MetodosEvaluacionService } from './metodos-evaluacion.service';

describe('MetodosEvaluacionService', () => {
  let service: MetodosEvaluacionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MetodosEvaluacionService],
    }).compile();

    service = module.get<MetodosEvaluacionService>(MetodosEvaluacionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
