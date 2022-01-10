import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'

import { createAttachmentPresignedUrl } from '../../businessLogic/leaves'

import { getUserId } from '../../auth/utils'

import { updateLeave, getLeavesPerLeaveId } from '../../businessLogic/leaves'

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    
    const uploadUrl = createAttachmentPresignedUrl(event.pathParameters.leaveId)
    const item = await getLeavesPerLeaveId(getUserId(event), event.pathParameters.leaveId)

    const updateLeaveRequest = {
      name: item.name,
      leaveDate: item.leaveDate,
      hours: item.hours,
      attachmentUrl: `https://serverless-p5-leave-images-178415772920-dev.s3.amazonaws.com/${event.pathParameters.leaveId}`
    }  
    await updateLeave(getUserId(event), event.pathParameters.leaveId, updateLeaveRequest)

    return {
      statusCode: 201,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({
        uploadUrl
      })
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
