import { PartialType } from '@nestjs/mapped-types';
import { CreateEstrategiasEnsenanzaDto } from './create-estrategias-ensenanza.dto';

export class UpdateEstrategiasEnsenanzaDto extends PartialType(CreateEstrategiasEnsenanzaDto) {}
