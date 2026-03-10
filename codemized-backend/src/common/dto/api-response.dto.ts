import { ApiProperty } from '@nestjs/swagger';

export class ApiResponseDto<T> {
  @ApiProperty({ example: true })
  success: boolean;

  @ApiProperty()
  data: T;

  @ApiProperty({ example: 'Operation completed successfully' })
  message: string;

  @ApiProperty({ example: 200 })
  statusCode: number;

  constructor(data: T, message = 'Success', statusCode = 200) {
    this.success = true;
    this.data = data;
    this.message = message;
    this.statusCode = statusCode;
  }
}

export class PaginatedResponseDto<T> extends ApiResponseDto<T[]> {
  @ApiProperty({ example: 1 })
  page: number;

  @ApiProperty({ example: 10 })
  limit: number;

  @ApiProperty({ example: 100 })
  total: number;

  constructor(data: T[], total: number, page: number, limit: number, message = 'Success') {
    super(data, message);
    this.total = total;
    this.page = page;
    this.limit = limit;
  }
}
