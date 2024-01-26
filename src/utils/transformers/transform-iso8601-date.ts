import type { TransformerArgFunc } from '../../types';

import * as classValidator from 'class-validator';
import * as nestCommon from '@nestjs/common';

export const transformIso8601Date: TransformerArgFunc<Date> = (params) => {
  const isValidDate = classValidator.isISO8601(params.value, {
    strict: true,
    strictSeparator: true,
  });

  if (!isValidDate) {
    throw new nestCommon.BadRequestException([
      `${params.key} must be a valid ISO 8601 date string`,
    ]);
  }

  return new Date(params.value);
};
