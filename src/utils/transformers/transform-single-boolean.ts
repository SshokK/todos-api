import type { TransformerArgFunc } from '../../types';

export const transformSingleBoolean: TransformerArgFunc<boolean> = (params) => {
  if (typeof params.value === 'boolean') {
    return params.value;
  }

  if (params.value === 'true') {
    return true;
  }

  if (params.value === 'false') {
    return false;
  }

  /**
   *
   * Return of the initial value ensures that the underlying
   * class-validator decorators will properly react to the passed
   * value
   *
   */
  return params.value;
};
