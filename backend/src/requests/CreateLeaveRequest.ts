import { integer } from "aws-sdk/clients/cloudfront";

/**
 * Fields in a request to create a single LEAVE item.
 */
export interface CreateLeaveRequest {
  name: string
  leaveDate: string
  hours: integer
}
