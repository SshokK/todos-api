import type { TransformerArgFunc } from '../../types';

export const transformStringArray: TransformerArgFunc<string[]> = (params) => {
  if (Array.isArray(params.value)) {
    return params.value.map(String);
  }

  return params.value.split(',').map(String);
};
