import * as nestCommon from '@nestjs/common';
import * as providers from '../../providers';
import * as repos from '../../repos';
import * as nestDevtools from '@nestjs/devtools-integration';
import * as globalConstants from '../../constants/global.constants';

@nestCommon.Module({
  imports: [
    nestDevtools.DevtoolsModule.register({
      http:
        globalConstants.ENV.NODE_ENV !== globalConstants.NODE_ENVS.PRODUCTION,
    }),
    providers.MongoModule,
    repos.TodoModule,
  ],
})
export class AppModule {}
