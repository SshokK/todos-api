import * as nestCore from '@nestjs/core';
import * as nestCommon from '@nestjs/common';
import * as globalConstants from './constants/global.constants';
import * as requestConstants from './constants/request.constants';
import * as app from './app';

(async () => {
  const nestApp = await nestCore.NestFactory.create(app.AppModule);

  nestApp.enableVersioning({
    type: nestCommon.VersioningType.URI,
    defaultVersion: requestConstants.ROUTE_DEFAULT_VERSION,
  });

  await nestApp.listen(globalConstants.ENV.PORT);
})();
