import { Body, Controller, Post } from '@nestjs/common';
import { MediumService } from './medium.service';
import { ReadMultipleDto } from './dto/read-multiple.dto';

@Controller('medium')
export class MediumController {
  constructor(private readonly mediumService: MediumService) {}

  @Post()
  async readMedium(@Body() data: ReadMultipleDto) {
    return await this.mediumService.readMedium(data);
  }
}
