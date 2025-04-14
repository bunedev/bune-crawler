import { ApiProperty } from '@nestjs/swagger';
import { Max, Min } from 'class-validator';

export class IncreaseViewYoutubeDto {
  @ApiProperty({
    default: '',
  })
  url: string;

  @ApiProperty({
    default: 50,
  })
  @Min(1)
  numberPlay: number;

  @ApiProperty({
    default: 30,
    description: 'Time reading in seconds',
  })
  timeReading: number;

  // số phiên làm việc
  @ApiProperty({
    default: 1,
  })
  @Min(1)
  @Max(10)
  numberSession: number;
}
