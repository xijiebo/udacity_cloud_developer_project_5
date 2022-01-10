import { integer } from "aws-sdk/clients/cloudfront";

/**
 * Fields in a request to update a single LEAVE item.
 */
export interface UpdateLeaveRequest {
  name: string
  leaveDate: string
  hours: integer
  attachmentUrl?: string
}