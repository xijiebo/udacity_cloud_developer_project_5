import { integer } from "aws-sdk/clients/cloudfront";

export interface LeaveItem {
  userId: string
  leaveId: string
  createdAt: string
  name: string
  leaveDate: string
  hours: integer
  attachmentUrl?: string
}
