import * as repos from '../../index';
import * as nestCommon from '@nestjs/common';
import * as classValidator from 'class-validator';

@classValidator.ValidatorConstraint({ name: 'IsIdUnique', async: true })
@nestCommon.Injectable()
export class IsIdUniqueConstraint
  implements classValidator.ValidatorConstraintInterface
{
  constructor(
    @nestCommon.Inject(nestCommon.forwardRef(() => repos.TodoService))
    private readonly todoService: repos.TodoService,
  ) {}

  async validate(id: string) {
    try {
      await this.todoService.findOne(id);
    } catch (e) {
      return true;
    }

    throw new nestCommon.ConflictException(['id is not unique']);
  }

  defaultMessage() {
    return 'id is not unique';
  }
}

export function IsIdUnique(
  validationOptions?: classValidator.ValidationOptions,
) {
  return function (object: object, propertyName: string) {
    classValidator.registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsIdUniqueConstraint,
    });
  };
}
