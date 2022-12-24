import { TodosAccess } from '../dataLayer/todosAcess'
import { TodoItem } from '../models/TodoItem'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'

import * as uuid from 'uuid'
  const todoAccess = new TodosAccess();

  export async function getAllTodos(userId: string): Promise<TodoItem[]> {
    return todoAccess.getAllTodos(userId);
    }

  export async function createTodo(userId: string, createTodoRequest: CreateTodoRequest): Promise<TodoItem> {

    const todoId = uuid.v4()

    return await todoAccess.createTodo({
      todoId,
      userId,
      name: createTodoRequest.name,
      dueDate: createTodoRequest.dueDate,
      createdAt: new Date().toISOString(),
      done: false
    })
  }

  export async function updateTodo( userId: string, todoId: string, updateTodoRequest: UpdateTodoRequest) {
    return await todoAccess.updateTodo(todoId, userId, {
      name: updateTodoRequest.name,
      dueDate: updateTodoRequest.dueDate,
      done: updateTodoRequest.done
    })
  }
  export async function deleteTodo(todoId: string, userId: string) {
    await todoAccess.deleteTodo(todoId, userId)
  }
  
  export async function removeTodoAttachment(userId: string, todoId: string): Promise<void> {
    return todoAccess.removeTodoAttachment(userId, todoId);
  }

  export async function updateTodoAttachment(userId: string, todoId: string, s3Key: string): Promise<void> {
    return todoAccess.updateTodoAttachment(userId, todoId, s3Key);
  }

  export async function todoExists(todoId: string): Promise<boolean> {
    return await todoAccess.todoExists(todoId)
  }
