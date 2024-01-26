import * as nestCore from '@nestjs/core';
import * as nestCommon from '@nestjs/common';
import * as nestFastify from '@nestjs/platform-fastify';
import * as nestSwagger from '@nestjs/swagger';

import * as globalConstants from './constants/global.constants';
import * as requestConstants from './constants/request.constants';
import * as app from './app';
import * as classValidator from 'class-validator';

(async () => {
  const nestApp =
    await nestCore.NestFactory.create<nestFastify.NestFastifyApplication>(
      app.AppModule,
      new nestFastify.FastifyAdapter(),
    );

  classValidator.useContainer(nestApp.select(app.AppModule), {
    fallbackOnErrors: true,
  });

  nestApp.useGlobalPipes(
    new nestCommon.ValidationPipe({
      stopAtFirstError: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  nestApp.enableVersioning({
    type: nestCommon.VersioningType.URI,
    defaultVersion: requestConstants.ROUTE_DEFAULT_VERSION,
  });

  nestApp.enableCors();

  const config = new nestSwagger.DocumentBuilder()
    .setTitle('Todos API')
    .setVersion('1.0')
    .build();

  const document = nestSwagger.SwaggerModule.createDocument(nestApp, config);

  nestSwagger.SwaggerModule.setup(
    requestConstants.SWAGGER_ROUTE,
    nestApp,
    document,
  );

  await nestApp.listen(globalConstants.ENV.PORT, globalConstants.ENV.HOST);
})();
