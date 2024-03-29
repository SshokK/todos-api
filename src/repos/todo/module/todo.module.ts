import * as nestCommon from '@nestjs/common';
import * as nestMongoose from '@nestjs/mongoose';
import * as service from '../service';
import * as controller from '../controller';
import * as validators from '../validators';
import * as schema from '../schema';

@nestCommon.Module({
  imports: [
    nestMongoose.MongooseModule.forFeature([
      {
        name: schema.Todo.name,
        schema: schema.TodoSchema,
      },
    ]),
  ],
  controllers: [controller.TodoController],
  providers: [
    service.TodoService,
    validators.IsIdUniqueConstraint
  ],
  exports: [service.TodoService],
})
export class TodoModule {}
