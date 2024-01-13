import * as nestMongoose from '@nestjs/mongoose';
import * as utils from '../../../utils';

@nestMongoose.Schema({
  timestamps: true,
  autoIndex: true,
  versionKey: false,
})
export class Todo {
  @nestMongoose.Prop({
    type: String,
    default: utils.getRandomId,
  })
  _id: string;

  @nestMongoose.Prop({
    default: 0,
  })
  order: number;

  @nestMongoose.Prop({
    default: '',
  })
  title: string;

  @nestMongoose.Prop({
    default: false,
  })
  isDone: boolean;

  @nestMongoose.Prop({
    default: Date.now,
  })
  date: Date;

  createdAt: Date;

  updatedAt: Date;
}

export const TodoSchema = nestMongoose.SchemaFactory.createForClass(Todo);
