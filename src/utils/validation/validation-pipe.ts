import type * as schema from 'joi';

export class ValidationPipe {
  constructor(
    private readonly schema: schema.Schema,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private readonly errorConstructor: new (...args: any[]) => any,
  ) {}

  public transform = (value: unknown) => {
    const result = this.schema.validate(value, {
      convert: true,
    });

    if (result.error) {
      const errorMessages = result.error.details
        .map((details) => details.message)
        .join(', ');

      throw new this.errorConstructor(errorMessages);
    }

    return result.value;
  };
}
