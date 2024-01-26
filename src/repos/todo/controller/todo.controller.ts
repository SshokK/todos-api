import * as service from '../service';
import * as nestCommon from '@nestjs/common';
import * as nestSwagger from '@nestjs/swagger';
import * as constants from './todo.controller.constants';
import * as requestConstants from '../../../constants/request.constants';
import * as utils from '../../../utils';
import * as schema from '../schema';
import * as dto from './todo.controller.dto';

@nestSwagger.ApiTags(constants.TAG)
@nestCommon.Controller({
  path: constants.ROUTE_BASE,
  version: requestConstants.ROUTE_VERSION.V1,
})
@nestCommon.UseInterceptors(
  utils.MongooseClassSerializerInterceptor(schema.Todo),
)
export class TodoController {
  constructor(
    @nestCommon.Inject(nestCommon.forwardRef(() => service.TodoService))
    private readonly todoService: service.TodoService,
  ) {}

  /**
   *
   * Returns a paginated list of todos
   *
   */
  @nestCommon.Get()
  @nestSwagger.ApiOkResponse({
    description: 'List of todos',
    type: [schema.Todo],
  })
  @nestSwagger.ApiBadRequestResponse({
    description: 'Wrong query params were passed',
    type: utils.BadRequestResponseDto,
  })
  public async [constants.ROUTE.GET_TODOS](
    @nestCommon.Query()
    queryParams: dto.GetTodosQueryParamsDto,
  ) {
    return this.todoService.findAll(queryParams);
  }

  /**
   *
   * Creates a new to do item and returns it
   *
   */
  @nestCommon.Post()
  @nestSwagger.ApiOkResponse({
    description: 'Created todo item',
    type: schema.Todo,
  })
  @nestSwagger.ApiBadRequestResponse({
    description: 'Wrong body was passed',
    type: utils.BadRequestResponseDto,
  })
  @nestSwagger.ApiConflictResponse({
    description: 'Passed id is not unique',
    type: utils.ConflictResponseDto,
  })
  public async [constants.ROUTE.CREATE_TODO](
    @nestCommon.Body()
    body: dto.CreateTodoBodyDto,
  ) {
    return this.todoService.create(body);
  }

  /**
   *
   * Update an item by id and returns it
   *
   */
  @nestCommon.Patch(':id')
  @nestSwagger.ApiOkResponse({
    description: 'Updated todo item',
    type: schema.Todo,
  })
  @nestSwagger.ApiNotFoundResponse({
    description: 'Todo was not found',
    type: utils.NotFoundResponseDto,
  })
  @nestSwagger.ApiBadRequestResponse({
    description: 'Wrong body or url params were passed',
    type: utils.BadRequestResponseDto,
  })
  public async [constants.ROUTE.UPDATE_TODO](
    @nestCommon.Param()
    urlParams: dto.UpdateTodoUrlParamsDto,

    @nestCommon.Body()
    body: dto.UpdateTodoBodyDto,
  ) {
    return this.todoService.updateOne(urlParams.id, body);
  }

  /**
   *
   * Update an item by id and returns it
   *
   */
  @nestCommon.Delete(':id')
  @nestSwagger.ApiOkResponse({
    description: 'Todo was successfully deleted',
  })
  @nestSwagger.ApiNotFoundResponse({
    description: 'Todo was not found',
    type: utils.NotFoundResponseDto,
  })
  @nestSwagger.ApiBadRequestResponse({
    description: 'Wrong url params were passed',
    type: utils.BadRequestResponseDto,
  })
  public async [constants.ROUTE.DELETE_TODO](
    @nestCommon.Param()
    urlParams: dto.DeleteTodoUrlParamsDto,
  ) {
    return this.todoService.deleteOne(urlParams.id);
  }

  /**
   *
   * Deletes multiple todos
   *
   */
  @nestCommon.Delete()
  @nestSwagger.ApiOkResponse({
    description: 'Deleted todos count',
    type: dto.BulkDeleteResponseDto,
  })
  @nestSwagger.ApiBadRequestResponse({
    description: 'Wrong body or query params were passed',
    type: utils.BadRequestResponseDto,
  })
  public async [constants.ROUTE.BULK_DELETE_TODOS](
    @nestCommon.Query()
    queryParams: dto.BulkDeleteQueryParamsDto,

    @nestCommon.Body()
    body: dto.BulkDeleteBodyDto,
  ) {
    return this.todoService.deleteMany({
      ...queryParams,
      ...body,
    });
  }

  /**
   *
   * Gets counted todos
   *
   */
  @nestCommon.Get('/count')
  @nestSwagger.ApiOkResponse({
    description: 'Todos counts',
    type: dto.CountAggregationResponseDto,
  })
  @nestSwagger.ApiBadRequestResponse({
    description: 'Wrong query params were passed',
    type: utils.BadRequestResponseDto,
  })
  public async [constants.ROUTE.AGGREGATE_COUNT](
    @nestCommon.Query()
    queryParams: dto.CountAggregationQueryParamsDto,
  ) {
    return this.todoService.aggregateCount(queryParams);
  }
}
