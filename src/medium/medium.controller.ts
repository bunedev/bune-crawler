import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { MediumService } from './medium.service';
import { ReadMultipleDto } from './dto/read-multiple.dto';
import { IncreaseViewDto } from './dto/increase-view.dto';

@Controller('medium')
export class MediumController {
  constructor(private readonly mediumService: MediumService) {}

  @Post()
  async readMedium(@Body() data: ReadMultipleDto) {
    return await this.mediumService.readMultipleMedium(data);
  }

  @Get('increase-view')
  async increaseViewArticle(@Query() increaseViewDto: IncreaseViewDto) {
    return await this.mediumService.increaseViewArticle(increaseViewDto);
  }
}
