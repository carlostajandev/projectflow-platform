import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateProjectDto {
  @ApiProperty({ example: 'My Awesome Project' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  name: string;

  @ApiProperty({ example: 'A project to track all tasks', required: false })
  @IsString()
  @IsOptional()
  description?: string;
}

export class UpdateProjectDto extends PartialType(CreateProjectDto) {}