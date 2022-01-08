
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import 'source-map-support/register'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'

import { CreateLeaveRequest } from '../../requests/CreateLeaveRequest'
import { getUserId } from '../utils';
import { createLeave } from '../../businessLogic/leaves'

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    console.log("createLeave event: ", event)

    const newLeave: CreateLeaveRequest = JSON.parse(event.body)
    if(!newLeave.name || !newLeave.leaveDate || !newLeave.hours) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          error: 'name , leaveDate, and hours are required.'
        })
      }     
    }

    const item = await createLeave(newLeave, getUserId(event))
    return {
      statusCode: 201,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({
        item
      })
    }

  })

handler.use(
  cors({
    credentials: true
  })
)

