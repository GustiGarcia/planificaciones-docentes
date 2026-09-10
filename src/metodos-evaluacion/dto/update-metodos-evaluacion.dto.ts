import { PartialType } from '@nestjs/mapped-types';
import { CreateMetodosEvaluacionDto } from './create-metodos-evaluacion.dto';

export class UpdateMetodosEvaluacionDto extends PartialType(CreateMetodosEvaluacionDto) {}
