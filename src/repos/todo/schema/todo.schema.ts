import * as nestMongoose from '@nestjs/mongoose';
import * as utils from '../../../utils';
import * as classTransformer from 'class-transformer';

@nestMongoose.Schema({
  timestamps: true,
  autoIndex: true,
  versionKey: false,
})
export class Todo {
  @classTransformer.Exclude({ toPlainOnly: true })
  @nestMongoose.Prop({
    type: String,
    default: utils.getRandomId,
  })
  _id: string;

  @classTransformer.Expose()
  public get id() {
    return this._id;
  }

  @classTransformer.Expose()
  @nestMongoose.Prop({
    default: 0,
    min: 0,
  })
  order: number;

  @classTransformer.Expose()
  @nestMongoose.Prop({
    default: '',
  })
  title: string;

  @classTransformer.Expose()
  @nestMongoose.Prop({
    default: '',
  })
  content: string;

  @classTransformer.Expose()
  @nestMongoose.Prop({
    default: false,
  })
  isDone: boolean;

  @classTransformer.Expose()
  @nestMongoose.Prop({
    default: Date.now,
  })
  date: Date;

  @classTransformer.Expose()
  createdAt: Date;

  @classTransformer.Expose()
  updatedAt: Date;
}

export const TodoSchema = nestMongoose.SchemaFactory.createForClass(Todo);

TodoSchema.loadClass(Todo);
