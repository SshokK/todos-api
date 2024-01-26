import * as nestSwagger from '@nestjs/swagger';
import * as nestCommon from '@nestjs/common';
import * as classValidator from 'class-validator';

import { ErrorResponseDto } from './error-response.dto';

export class ConflictResponseDto extends ErrorResponseDto {
  @nestSwagger.ApiProperty({
    description: 'Response status code',
    example: nestCommon.HttpStatus.CONFLICT,
  })
  @classValidator.IsInt()
  statusCode: nestCommon.HttpStatus.CONFLICT;
}
