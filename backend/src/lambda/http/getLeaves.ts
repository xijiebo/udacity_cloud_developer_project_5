
import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import { getUserId } from '../../auth/utils'
import { getLeavesPerUser } from '../../businessLogic/leaves'

export const handler = middy( async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

  console.log('getLeaves event', event)

  const leaveItems = await getLeavesPerUser(getUserId(event));

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      items: leaveItems
    })
  }
})

handler.use(
  cors({
    credentials: true
  })
)


