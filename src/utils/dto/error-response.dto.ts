import * as nestSwagger from '@nestjs/swagger';
import * as classValidator from 'class-validator';
import * as nestCommon from '@nestjs/common';

export class ErrorResponseDto {
  @nestSwagger.ApiProperty({
    type: [String],
    description: 'Error messages',
  })
  @classValidator.IsArray()
  @classValidator.IsString()
  message: string[];

  @nestSwagger.ApiProperty({
    description: 'Error type',
  })
  @classValidator.IsString()
  error: string;

  @nestSwagger.ApiProperty({
    description: 'Response status code',
    example: nestCommon.HttpStatus.BAD_REQUEST,
  })
  @classValidator.IsInt()
  statusCode: nestCommon.HttpStatus;
}
