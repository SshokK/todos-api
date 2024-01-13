import type mongoose from 'mongoose';
import type * as todoSchema from './todo.schema';

export type TodoDocument = mongoose.HydratedDocument<todoSchema.Todo>;
