import { Module } from '@nestjs/common';
import { MediumController } from './medium.controller';
import { MediumService } from './medium.service';

@Module({
  controllers: [MediumController],
  providers: [MediumService]
})
export class MediumModule {}
