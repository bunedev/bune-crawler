import { ApiProperty } from '@nestjs/swagger';
import { Min } from 'class-validator';

export class IncreaseViewDto {
  @ApiProperty({
    default: 'url1',
  })
  url: string;

  @ApiProperty({
    default: 50,
  })
  @Min(1)
  numberPlay: number;
}
