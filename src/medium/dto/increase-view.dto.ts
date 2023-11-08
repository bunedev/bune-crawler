import { ApiProperty } from '@nestjs/swagger';
import { Min } from 'class-validator';

export class IncreaseViewDto {
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
    default: 2000,
    description: 'Time reading in milliseconds',
  })
  timeReading: number;
}
