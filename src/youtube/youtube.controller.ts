import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { YoutubeService } from './youtube.service';
import { IncreaseViewYoutubeDto } from './dto/increase-view.dto';

@Controller('youtube')
export class YoutubeController {
    constructor(private readonly youtubeService: YoutubeService) {}

    @Get('increase-view')
    @ApiOperation({
      summary: 'increase view for youtube none user using anonymous: chormium',
    })
    async increaseViewAnonymous(@Query() increaseViewDto: IncreaseViewYoutubeDto) {
      return await this.youtubeService.increaseViewAnonymousPromise(increaseViewDto);
    }

  
}
