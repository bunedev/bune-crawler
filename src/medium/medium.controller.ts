import { Controller, Get, Param, Query } from '@nestjs/common';
import { MediumService } from './medium.service';
import { ReadMultipleDto } from './dto/read-multiple.dto';
import { IncreaseViewDto } from './dto/increase-view.dto';
import { ApiOperation } from '@nestjs/swagger';

@Controller('medium')
export class MediumController {
  constructor(private readonly mediumService: MediumService) {}

  @Get('login')
  @ApiOperation({
    summary: 'login to medium with url token -- chrome',
  })
  async login(@Query('url') url: string) {
    return await this.mediumService.login(url);
  }

  @Get('read')
  @ApiOperation({
    summary:
      'Read a medium claps 50x and comment article by devhoangkien -- chrome',
  })
  async readMedium(@Query() data: ReadMultipleDto) {
    if (typeof data.listUrl == 'string') {
      data.listUrl = [data.listUrl];
    }
    console.log(data);
    return await this.mediumService.readMultipleMedium(data);
  }

  @Get('increase-view')
  @ApiOperation({
    summary: 'increase view for a medium article none user: chormium',
  })
  async increaseViewArticle(@Query() increaseViewDto: IncreaseViewDto) {
    return await this.mediumService.increaseViewArticle(increaseViewDto);
  }

  @Get('increase-view-with-user-edge')
  @ApiOperation({
    summary: 'increase view for a medium article with user: edge',
  })
  async increaseViewArticleWithUserEdge(
    @Query() increaseViewDto: IncreaseViewDto,
  ) {
    return await this.mediumService.increaseViewArticleWithUserEdge(
      increaseViewDto,
    );
  }
}
