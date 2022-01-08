
import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'

import { deleteLeave, getLeavesPerLeaveId} from '../../businessLogic/leaves'
import { getUserId } from '../utils'

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

    const item = await getLeavesPerLeaveId(getUserId(event), event.pathParameters.leaveId)
    if(!item) {
      return {
        statusCode: 404,
        body: JSON.stringify({
          error: 'Leave item not found.'
        })
      };   
    }

    await deleteLeave(getUserId(event), event.pathParameters.leaveId)
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: ''
    }
  }


)

handler
  .use(httpErrorHandler())
  .use(
    cors({
      credentials: true
    })
  )
