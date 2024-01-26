import type { TransformerArgFunc } from '../../types';

export const transformNumericArray: TransformerArgFunc<number[]> = (params) => {
  if (Array.isArray(params.value)) {
    return params.value;
  }

  return params.value.split(',').map(Number);
};
