import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MediumModule } from './medium/medium.module';
import { YoutubeModule } from './youtube/youtube.module';

@Module({
  imports: [MediumModule, YoutubeModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
