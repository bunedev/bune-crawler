import { ApiProperty } from '@nestjs/swagger';
import { IsArray } from 'class-validator';

export class ReadMultipleDto {
  @ApiProperty({
    default: ['url1'],
  })
  @IsArray()
  listUrl: string[];
}
