import { Module } from '@nestjs/common';
import { EstrategiasEnsenanzaService } from './estrategias-ensenanza.service';
import { EstrategiasEnsenanzaController } from './estrategias-ensenanza.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EstrategiaEnsenanza } from 'src/entities/estrategia-ensenanza.entity';

@Module({
  controllers: [EstrategiasEnsenanzaController],
  providers: [EstrategiasEnsenanzaService],
  imports: [TypeOrmModule.forFeature([EstrategiaEnsenanza])],

})
export class EstrategiasEnsenanzaModule {}
