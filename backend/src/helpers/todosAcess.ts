import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { createLogger } from '../utils/logger'
import { TodoItem } from '../models/TodoItem'
import { TodoUpdate } from '../models/TodoUpdate';

const XAWS = AWSXRay.captureAWS(AWS)

const logger = createLogger('Todos access data ')

// TODO: Implement the dataLayer logic
export class TodosAccess {

  constructor(
    private readonly docClient: DocumentClient = new XAWS.DynamoDB.DocumentClient(),
    private readonly todosTable = process.env.TODOS_TABLE,
    private readonly todoCreatedIndex = process.env.TODOS_CREATED_AT_INDEX,
    private readonly attachmentBucket = process.env.ATTACHMENT_S3_BUCKET
  ) {
  }

  async getAllTodos(userId: string): Promise<TodoItem[]> {
    logger.info('Getting all todos')

    const result = await this.docClient.query({
      TableName: this.todosTable,
      IndexName: this.todoCreatedIndex,
      KeyConditionExpression: 'userId = :pk',
      ExpressionAttributeValues: {
        ':pk': userId
      }
    }).promise()

    const items = result.Items
    return items as TodoItem[]
  }

  async createTodo(todo: TodoItem): Promise<TodoItem> {
    logger.info('Create new todo')

    await this.docClient.put({
      TableName: this.todosTable,
      Item: todo
    }).promise()

    return todo
  }

  async updateTodo(userId: String, todoId: String, updateTodoItem: TodoUpdate): Promise<TodoUpdate> {
    logger.info('Update todo')

    await this.docClient.update({
      TableName: this.todosTable,
      Key: {
        todoId: todoId,
        userId: userId
      },
      UpdateExpression: "set #todo_name = :name, dueDate = :dueDate, done = :done",
      ExpressionAttributeNames: {
        '#todo_name': 'name',
      },
      ExpressionAttributeValues: {
        ":name": updateTodoItem.name,
        ":dueDate": updateTodoItem.dueDate,
        ":done": updateTodoItem.done
      },
      ReturnValues: "UPDATED_NEW"
    }).promise()

    return updateTodoItem
  }

  async deleteTodo(userId: String, todoId: String) {
    logger.info('Delete todo')

    await this.docClient.delete({
      TableName: this.todosTable,
      Key: {
        todoId: todoId,
        userId: userId
      }
    }, (err) => {
      if (err) {
        throw new Error("")
      }
    }).promise()
  }
  async removeTodoAttachment(userId: string, todoId: string): Promise<void> {
    await this.docClient.update({
      TableName: this.todosTable,
      Key: { todoId, userId },
      UpdateExpression: 'set #attachmentUrl = :attachmentUrl',
      ExpressionAttributeNames: { '#attachmentUrl': 'attachmentUrl' },
      ExpressionAttributeValues: {
        ':attachmentUrl': ''
      },
      ReturnValues: "UPDATED_NEW"
    }).promise();
  }
  async updateTodoAttachment(userId: string, todoId: string, s3Key: string): Promise<void> {
    await this.docClient.update({
      TableName: this.todosTable,
      Key: { todoId, userId },
      UpdateExpression: 'set #attachmentUrl = :attachmentUrl',
      ExpressionAttributeNames: { '#attachmentUrl': 'attachmentUrl' },
      ExpressionAttributeValues: {
        ':attachmentUrl': `https://${this.attachmentBucket}.s3.amazonaws.com/${s3Key}`
      },
      ReturnValues: "UPDATED_NEW"
    }).promise();
  }
  async todoExists(todoId: string): Promise<boolean> {
    const result = await this.docClient
      .get({
        TableName: this.todosTable,
        Key: {
          todoId
        }
      })
      .promise()

    return !!result.Item
  }
}
