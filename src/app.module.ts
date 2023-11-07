import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MediumModule } from './medium/medium.module';

@Module({
  imports: [MediumModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
