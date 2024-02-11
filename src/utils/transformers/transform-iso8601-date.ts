import type { TransformerArgFunc } from '../../types';

import * as classValidator from 'class-validator';
import * as nestCommon from '@nestjs/common';
import * as dateUtils from '../date';

export const transformIso8601Date: TransformerArgFunc<Date> = (params) => {
  if (!dateUtils.isValidDate(params.value)) {
    throw new nestCommon.BadRequestException([
      `${params.key} must be a valid ISO 8601 date string`,
    ]);
  }

  const isValidDate = classValidator.isISO8601(
    params.value instanceof Date ? params.value.toISOString() : params.value,
    {
      strict: true,
      strictSeparator: true,
    },
  );

  if (!isValidDate) {
    throw new nestCommon.BadRequestException([
      `${params.key} must be a valid ISO 8601 date string`,
    ]);
  }

  return new Date(params.value);
};
