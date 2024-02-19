import * as nestSwagger from '@nestjs/swagger';
import * as classValidator from 'class-validator';
import * as classTransformer from 'class-transformer';
import * as utils from '../../../utils';
import * as schema from '../schema';
import * as validators from '../validators';
import * as sortConstants from '../../../constants/sort.constants';
import * as constants from './todo.controller.constants';

export class TodosQueryParamFiltersDto {
  @nestSwagger.ApiProperty({
    type: [String],
    description: 'Filters todos by ids',
    default: [],
    required: false,
  })
  @classTransformer.Transform(utils.transformStringArray)
  @classValidator.IsOptional()
  @classValidator.IsArray()
  @classValidator.IsString({ each: true })
  id?: schema.Todo['id'][];

  @nestSwagger.ApiProperty({
    type: String,
    description: 'Filters todos by title',
    required: false,
  })
  @classValidator.IsOptional()
  @classValidator.IsString()
  @classValidator.MaxLength(256)
  title?: schema.Todo['title'];

  @nestSwagger.ApiProperty({
    type: Boolean,
    description: 'Filters todos done status',
    required: false,
  })
  @classValidator.IsOptional()
  @classTransformer.Transform(utils.transformSingleBoolean)
  @classValidator.IsBoolean()
  isDone?: schema.Todo['isDone'];

  @nestSwagger.ApiProperty({
    type: () => Date,
    description: 'Filters todos by date range',
  })
  @classValidator.IsOptional()
  @classTransformer.Transform(utils.transformIso8601Date)
  dateRangeStart?: schema.Todo['date'];

  @nestSwagger.ApiProperty({
    type: () => Date,
    description: 'Filters todos by date range',
  })
  @classValidator.IsOptional()
  @classTransformer.Transform(utils.transformIso8601Date)
  dateRangeEnd?: schema.Todo['date'];
}

export class GetTodosQueryParamsDto extends TodosQueryParamFiltersDto {
  @nestSwagger.ApiProperty({
    minimum: 0,
    maximum: 100,
  })
  @classValidator.IsInt()
  @classValidator.Max(100)
  @classValidator.Min(0)
  limit: number;

  @nestSwagger.ApiProperty({
    minimum: 0,
  })
  @classValidator.IsInt()
  @classValidator.Min(0)
  offset: number;

  @nestSwagger.ApiProperty({
    type: String,
    required: false,
    description: 'Sort field',
  })
  @classValidator.IsOptional()
  @classValidator.IsString()
  @classValidator.MaxLength(256)
  @classValidator.IsIn(constants.ALLOWED_SORT_FIELDS)
  sortField?: keyof schema.Todo;

  @nestSwagger.ApiProperty({
    required: false,
    enum: sortConstants.SORT_ORDER,
    example: sortConstants.SORT_ORDER.ASC,
    default: sortConstants.SORT_ORDER.DESC,
    description: 'Sort order',
  })
  @classValidator.IsOptional()
  @classValidator.IsIn(Object.values(sortConstants.SORT_ORDER))
  sortOrder?: sortConstants.SORT_ORDER;
}

export class GetTodosTotalCountQueryParamsDto extends TodosQueryParamFiltersDto {}

export class CreateTodoBodyDto {
  @nestSwagger.ApiProperty({
    type: String,
    required: false,
    description: 'Unique ID (UUID v4 format)',
    example: utils.getRandomId(),
  })
  @classValidator.IsOptional()
  @classValidator.IsUUID()
  @validators.IsIdUnique()
  id?: schema.Todo['id'];

  @nestSwagger.ApiProperty({
    type: Boolean,
    required: false,
  })
  @classValidator.IsOptional()
  @classValidator.IsBoolean()
  isDone?: schema.Todo['isDone'];

  @nestSwagger.ApiProperty({
    type: Number,
    required: false,
    description:
      "Order of the todo within one day of it's date. This will be set automatically if the passed order is higher than the max one of the same day todos",
  })
  @classValidator.IsOptional()
  @classValidator.IsInt()
  order?: schema.Todo['order'];

  @nestSwagger.ApiProperty({
    type: String,
    required: false,
    maximum: 256,
  })
  @classValidator.IsOptional()
  @classValidator.IsString()
  @classValidator.MaxLength(256)
  title?: schema.Todo['title'];

  @nestSwagger.ApiProperty({
    type: String,
    required: false,
    maximum: 256,
  })
  @classValidator.IsOptional()
  @classValidator.IsString()
  @classValidator.MaxLength(256)
  content?: schema.Todo['content'];

  @nestSwagger.ApiProperty({
    type: Date,
  })
  @classValidator.IsISO8601({ strict: true, strictSeparator: true })
  date: schema.Todo['date'];
}

export class UpdateTodoUrlParamsDto {
  @nestSwagger.ApiProperty({
    description: 'Id of the todo that will be updated',
    example: utils.getRandomId(),
  })
  @classValidator.IsUUID()
  id: schema.Todo['id'];
}

export class UpdateTodoBodyDto {
  @nestSwagger.ApiProperty({
    type: Boolean,
    required: false,
  })
  @classValidator.IsOptional()
  @classValidator.IsBoolean()
  isDone?: schema.Todo['isDone'];

  @nestSwagger.ApiProperty({
    type: Number,
    required: false,
    description:
      "Order of the todo within one day of it's date. This will be set automatically if the passed order is higher than the max one of the same day todos",
  })
  @classValidator.IsOptional()
  @classValidator.IsInt()
  order?: schema.Todo['order'];

  @nestSwagger.ApiProperty({
    type: String,
    required: false,
    maximum: 256,
  })
  @classValidator.IsOptional()
  @classValidator.IsString()
  @classValidator.MaxLength(256)
  title?: schema.Todo['title'];

  @nestSwagger.ApiProperty({
    type: String,
    required: false,
    maximum: 256,
  })
  @classValidator.IsOptional()
  @classValidator.IsString()
  @classValidator.MaxLength(256)
  content?: schema.Todo['content'];

  @nestSwagger.ApiProperty({
    type: Date,
    required: false,
  })
  @classValidator.IsOptional()
  @classValidator.IsISO8601({ strict: true, strictSeparator: true })
  date?: schema.Todo['date'];
}

export class DeleteTodoUrlParamsDto {
  @nestSwagger.ApiProperty({
    description: 'Id of todo to be deleted (UUID v4 format)',
  })
  @classValidator.IsUUID()
  id: schema.Todo['id'];
}

export class BulkDeleteQueryParamsDto extends TodosQueryParamFiltersDto {}

export class BulkDeleteResponseDto {
  @nestSwagger.ApiProperty({
    required: false,
  })
  @classValidator.IsInt()
  deletedCount: number;
}

export class GetCountByStatusQueryParamsDto extends TodosQueryParamFiltersDto {
  @nestSwagger.ApiProperty({
    type: () => Date,
    description:
      'Date that determines if the tasks are overdue or not. Acts as "less than"',
  })
  @classTransformer.Transform(utils.transformIso8601Date)
  @classValidator.IsDate()
  dueDate: Date;
}

export class GetCountByStatusResponseDto {
  @nestSwagger.ApiProperty({
    type: Number,
    description: 'Done todos count',
  })
  @classValidator.IsInt()
  doneCount: number;

  @nestSwagger.ApiProperty({
    type: Number,
    description: 'Overdue todos count',
  })
  @classValidator.IsInt()
  overdueCount: number;

  @nestSwagger.ApiProperty({
    type: Number,
    description: 'Undone future todos count',
  })
  @classValidator.IsInt()
  undoneCount: number;
}

export class GetCountByDatesHeadersDto {
  @classTransformer.Expose({ name: 'x-timezone-offset' })
  @classTransformer.Transform(utils.transformTimezone)
  @classValidator.IsTimeZone({
    message: 'X-Timezone-Offset must be a valid offset',
  })
  @classValidator.IsOptional()
  timezone: string;
}

export class GetCountByDatesQueryParamsDto extends TodosQueryParamFiltersDto {
  @nestSwagger.ApiProperty({
    minimum: 0,
    maximum: 100,
  })
  @classValidator.IsInt()
  @classValidator.Max(100)
  @classValidator.Min(0)
  limit: number;

  @nestSwagger.ApiProperty({
    minimum: 0,
  })
  @classValidator.IsInt()
  @classValidator.Min(0)
  offset: number;
}

export class GetCountByDatesResponseDto {
  @nestSwagger.ApiProperty({
    type: String,
    description: 'Todo date',
  })
  @classValidator.IsString()
  date: string;

  @nestSwagger.ApiProperty({
    type: Number,
    description: 'Todos count within the date range',
  })
  @classValidator.IsInt()
  count: number;
}
