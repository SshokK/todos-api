import * as nestSwagger from '@nestjs/swagger';
import * as classValidator from 'class-validator';
import * as classTransformer from 'class-transformer';
import * as transformers from '../transformers';

export class DateRangeDto<T> {
  @nestSwagger.ApiProperty({
    type: () => Date,
    description: 'Date range start',
  })
  @classValidator.IsOptional()
  @classTransformer.Transform(transformers.transformIso8601Date)
  rangeStart?: T;

  @nestSwagger.ApiProperty({
    type: () => Date,
    description: 'Date range end',
  })
  @classValidator.IsOptional()
  @classTransformer.Transform(transformers.transformIso8601Date)
  rangeEnd?: T;
}
