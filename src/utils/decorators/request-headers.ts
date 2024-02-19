import * as nestCommon from '@nestjs/common';
import * as classTransformer from 'class-transformer';
import * as classValidator from 'class-validator';

export const RequestHeaders = nestCommon.createParamDecorator(
  async (value: any, ctx: nestCommon.ExecutionContext) => {
    const headers = ctx.switchToHttp().getRequest().headers;

    const dto = classTransformer.plainToInstance(value, headers, {
      excludeExtraneousValues: true,
    });

    const errors: classValidator.ValidationError[] =
      await classValidator.validate(dto);

    if (errors.length > 0) {
      throw new nestCommon.BadRequestException(
        errors.map((obj) => Object.values(obj.constraints)).flat(),
      );
    }

    return dto;
  },
);
