import { ApiProperty } from '@nestjs/swagger';

export class ReadMultipleDto {
  @ApiProperty({
    default: [''],
  })
  listUrl: string[];

  @ApiProperty({
    default: 2000,
    description: 'Time reading in milliseconds',
  })
  timeReading: number;
}
