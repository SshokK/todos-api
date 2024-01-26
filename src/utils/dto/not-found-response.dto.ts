import * as nestSwagger from '@nestjs/swagger';
import * as nestCommon from '@nestjs/common';
import * as classValidator from 'class-validator';

export class NotFoundResponseDto {
  @nestSwagger.ApiProperty({
    type: String,
    description: 'Error message',
  })
  @classValidator.IsString()
  message: string;

  @nestSwagger.ApiProperty({
    description: 'Response status code',
    example: nestCommon.HttpStatus.NOT_FOUND,
  })
  @classValidator.IsInt()
  statusCode: nestCommon.HttpStatus.NOT_FOUND;
}
