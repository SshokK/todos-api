import * as nestMongoose from '@nestjs/mongoose';
import * as nestSwagger from '@nestjs/swagger';
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

  @nestSwagger.ApiProperty({
    type: String,
    example: utils.getRandomId(),
    description: 'Todo item unique id',
  })
  @classTransformer.Expose()
  public get id() {
    return this._id;
  }

  @nestSwagger.ApiProperty({
    description: "Order with the todo's current date",
  })
  @classTransformer.Expose()
  @nestMongoose.Prop({
    default: 0,
    min: 0,
  })
  order: number;

  @nestSwagger.ApiProperty({
    description: 'Title of the todo',
  })
  @classTransformer.Expose()
  @nestMongoose.Prop({
    default: '',
  })
  title: string;

  @nestSwagger.ApiProperty({
    description: "Todo's content. It a richtext",
  })
  @classTransformer.Expose()
  @nestMongoose.Prop({
    default: '',
  })
  content: string;

  @nestSwagger.ApiProperty({
    description: "Todo's completion indicator",
  })
  @classTransformer.Expose()
  @nestMongoose.Prop({
    default: false,
  })
  isDone: boolean;

  @nestSwagger.ApiProperty({
    description: "Todo's date",
  })
  @classTransformer.Expose()
  @nestMongoose.Prop({
    default: Date.now,
  })
  date: Date;

  @nestSwagger.ApiProperty({
    description: "Todo's creation date",
  })
  createdAt: Date;

  @nestSwagger.ApiProperty({
    description: "Todo's date of the last update",
  })
  updatedAt: Date;
}

export const TodoSchema = nestMongoose.SchemaFactory.createForClass(Todo);

TodoSchema.loadClass(Todo);
