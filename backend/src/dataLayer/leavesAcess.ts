import * as AWS from 'aws-sdk'
import { integer } from 'aws-sdk/clients/cloudfront'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { LeaveItem } from '../models/LeaveItem'

const AWSXRay = require('aws-xray-sdk')

const XAWS = AWSXRay.captureAWS(AWS)

const userIdIndex = process.env.USER_ID_INDEX

export class LeavesAccess {

    constructor(
      private readonly docClient: DocumentClient = createDynamoDBClient(),
      private readonly leavesTable = process.env.LEAVES_TABLE) {
    }

    async getLeavesPerLeaveId(userId: string, leaveId: string): Promise<LeaveItem> {
        console.log('Getting leave by id ', userId, leaveId)
    
        const result = await this.docClient.get({
            TableName: this.leavesTable,
            Key: {
                userId,
                leaveId
            }
          }).promise()
    
        const item = result.Item
        return item as LeaveItem
      }

    async getLeavesPerUser(userId: string): Promise<LeaveItem[]> {
        console.log('Getting all leaves for user ', userId)
    
        const result = await this.docClient.query({
            TableName: this.leavesTable,
            IndexName : userIdIndex,
            KeyConditionExpression: 'userId = :userId',
            ExpressionAttributeValues: {
              ':userId': userId
            },
            ScanIndexForward: false
          }).promise()
    
        const items = result.Items
        return items as LeaveItem[]
      }
  
    async createLeave(leaveItem: LeaveItem): Promise<LeaveItem> {
      await this.docClient.put({
        TableName: this.leavesTable,
        Item: leaveItem
      }).promise()
  
      return leaveItem
    }

    async deleteLeave(userId: string, leaveId: string) {
        await this.docClient.delete({
          TableName: this.leavesTable,
          Key: {
              "userId": userId,
              "leaveId": leaveId
          }
        }).promise()       
      }

      async updateLeave(userId: string, leaveId: string, name: string, leaveDate: string, hours: integer) {
        await this.docClient.update({
          TableName: this.leavesTable,
          Key: {
            "userId": userId,
            "leaveId": leaveId
          },
          UpdateExpression: "set #nm = :name, leaveDate=:leaveDate, hours=:hours",
          ExpressionAttributeValues:{
            ":name": name,
            ":leaveDate":leaveDate,
            ":hours":hours
          },
          ExpressionAttributeNames:{
            "#nm": "name"
          }
        }).promise()
    
      }
  }

  function createDynamoDBClient() {
    if (process.env.IS_OFFLINE) {
      console.log('Creating a local DynamoDB instance')
      return new XAWS.DynamoDB.DocumentClient({
        region: 'localhost',
        endpoint: 'http://localhost:8000'
      })
    }
  
    return new XAWS.DynamoDB.DocumentClient()
  }
