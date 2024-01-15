import * as nestCore from '@nestjs/core';
import * as nestCommon from '@nestjs/common';
import * as globalConstants from './constants/global.constants';
import * as requestConstants from './constants/request.constants';
import * as app from './app';
import * as nestFastify from '@nestjs/platform-fastify';

(async () => {
  const nestApp =
    await nestCore.NestFactory.create<nestFastify.NestFastifyApplication>(
      app.AppModule,
      new nestFastify.FastifyAdapter(),
    );

  nestApp.enableVersioning({
    type: nestCommon.VersioningType.URI,
    defaultVersion: requestConstants.ROUTE_DEFAULT_VERSION,
  });

  await nestApp.listen(globalConstants.ENV.PORT, '0.0.0.0');
})();
