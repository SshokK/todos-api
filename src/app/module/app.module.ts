import * as nestCommon from '@nestjs/common';
import * as providers from '../../providers';
import * as repos from '../../repos';

@nestCommon.Module({
  imports: [providers.MongoModule, repos.TodoModule],
})
export class AppModule {}
