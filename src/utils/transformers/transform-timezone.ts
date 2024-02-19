import type { TransformerArgFunc } from '../../types';

import * as nestCommon from '@nestjs/common';
import * as dateUtils from '../date';

export const transformTimezone: TransformerArgFunc<string> = (params) => {
  if (typeof params.value !== 'string') {
    return undefined;
  }

  try {
    return dateUtils.getTimezoneFromOffset(params.value);
  } catch (e) {
    throw new nestCommon.BadRequestException([`Invalid timezone offset`]);
  }
};
