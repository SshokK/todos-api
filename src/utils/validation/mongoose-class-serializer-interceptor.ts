import * as nestCommon from '@nestjs/common';
import * as classTransformer from 'class-transformer';
import * as mongoose from 'mongoose';

export function MongooseClassSerializerInterceptor(
  classToIntercept: nestCommon.Type,
): typeof nestCommon.ClassSerializerInterceptor {
  return class Interceptor extends nestCommon.ClassSerializerInterceptor {
    private changePlainObjectToClass(document: nestCommon.PlainLiteralObject) {
      if (!(document instanceof mongoose.Document)) {
        return document;
      }

      return classTransformer.plainToClass(classToIntercept, document.toJSON());
    }

    private prepareResponse(
      response: nestCommon.PlainLiteralObject | nestCommon.PlainLiteralObject[],
    ) {
      if (Array.isArray(response)) {
        return response.map(this.changePlainObjectToClass);
      }

      return this.changePlainObjectToClass(response);
    }

    serialize(
      response: nestCommon.PlainLiteralObject | nestCommon.PlainLiteralObject[],
      options: classTransformer.ClassTransformOptions,
    ) {
      return super.serialize(this.prepareResponse(response), options);
    }
  };
}
