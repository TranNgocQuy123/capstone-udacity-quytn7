import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'
import { createPresignedUrl } from '../../businessLogic/attachmentUtils'
import { createLogger } from '../../utils/logger'
const logger = createLogger('Generate Upload Url');
export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

    // const todoId = event.pathParameters.todoId
    // TODO: Return a presigned URL to upload a file for a TODO item with the provided id
    const payload = JSON.parse(event.body)
    const s3Key = payload.s3Key
    const url = await createPresignedUrl(s3Key);
    logger.info('Upload url: %s', url);
    return {
      statusCode: 202,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({
        url
      })
    }
  }
)

handler
  .use(httpErrorHandler())
  .use(
    cors({
      origin: "*",
      credentials: true
    })
  )
