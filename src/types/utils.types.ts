import type * as classTransformer from 'class-transformer';

export type TransformerArgFunc<T> = (
  params: Parameters<Parameters<typeof classTransformer.Transform>[0]>[0],
) => T;
