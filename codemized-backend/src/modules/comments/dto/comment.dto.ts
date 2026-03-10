import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCommentDto {
  @ApiProperty({ example: 'This task is blocked by issue #123' })
  @IsString()
  @IsNotEmpty()
  content: string;
}