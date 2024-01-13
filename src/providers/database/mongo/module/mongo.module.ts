import * as nestMongoose from '@nestjs/mongoose';
import * as nestCommon from '@nestjs/common';
import * as globalConstants from '../../../../constants/global.constants';

@nestCommon.Module({
  imports: [
    nestMongoose.MongooseModule.forRoot(
      globalConstants.ENV.MONGO_CONNECTION_URL,
    ),
  ],
})
export class MongoModule {}
