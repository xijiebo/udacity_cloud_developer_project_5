
import { LeavesAccess } from '../dataLayer/leavesAcess'
import { getUploadUrl } from '../helpers/attachmentUtils';
import { LeaveItem } from '../models/LeaveItem'
import { CreateLeaveRequest } from '../requests/CreateLeaveRequest'
import { UpdateLeaveRequest } from '../requests/UpdateLeaveRequest'
import * as uuid from 'uuid'


const leavesAccess = new LeavesAccess()

export async function getLeavesPerLeaveId(userId: string, leaveId: string): Promise<LeaveItem> {
    return leavesAccess.getLeavesPerLeaveId(userId, leaveId)
  }

export async function getLeavesPerUser(userId: string): Promise<LeaveItem[]> {
    return leavesAccess.getLeavesPerUser(userId)
  }

export async function createLeave(
  createLeaveRequest: CreateLeaveRequest,
  userId: string
): Promise<LeaveItem> {

  return await leavesAccess.createLeave({
    userId: userId,
    leaveId: uuid.v4(),
    createdAt: new Date().toISOString(),
    ...createLeaveRequest
  })
}

export async function deleteLeave(userId: string, leaveId: string) {
    return leavesAccess.deleteLeave(userId, leaveId)
}

export async function updateLeave(
    userId: string, 
    leaveId: string, 
    updateLeaveRequest: UpdateLeaveRequest
  ) {
    return await leavesAccess.updateLeave(
        userId, leaveId, updateLeaveRequest.name, updateLeaveRequest.leaveDate,updateLeaveRequest.hours, updateLeaveRequest.attachmentUrl
    )
}

export function createAttachmentPresignedUrl(imageId: string): string {
    console.log("In createAttachmentPresignedUrl...")
    return getUploadUrl(imageId)
}
