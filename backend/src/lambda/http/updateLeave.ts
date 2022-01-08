
import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'

import { updateLeave, getLeavesPerLeaveId } from '../../businessLogic/leaves'
import { UpdateLeaveRequest } from '../../requests/UpdateLeaveRequest'
import { getUserId } from '../utils'

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {


    const updateLeaveRequest: UpdateLeaveRequest = JSON.parse(event.body)

    if(!updateLeaveRequest.name || !updateLeaveRequest.leaveDate || !updateLeaveRequest.hours) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          error: 'name, leaveDate, and hours are required.'
        })
      }     
    }

    const item = await getLeavesPerLeaveId(getUserId(event), event.pathParameters.leaveId)
    if(!item) {
      return {
        statusCode: 404,
        body: JSON.stringify({
          error: 'Leave item not found.'
        })
      };   
    }

    await updateLeave(getUserId(event), event.pathParameters.leaveId, updateLeaveRequest)
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: ''
    }
  })

handler
  .use(httpErrorHandler())
  .use(
    cors({
      credentials: true
    })
  )
  
