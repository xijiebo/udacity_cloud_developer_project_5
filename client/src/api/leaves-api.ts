import { apiEndpoint } from '../config'
import { Leave } from '../types/Leave';
import { CreateLeaveRequest } from '../types/CreateLeaveRequest';
import Axios from 'axios'
import { UpdateLeaveRequest } from '../types/UpdateLeaveRequest';

export async function getLeaves(idToken: string): Promise<Leave[]> {
  console.log('Fetching Leaves')
  console.log('apiEndpoint: ' + `${apiEndpoint}`)
  const response = await Axios.get(`${apiEndpoint}/leaves`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    },
  })
  console.log('Leaves:', response.data)
  return response.data.items
}

export async function createLeave(
  idToken: string,
  newLeave: CreateLeaveRequest
): Promise<Leave> {
  const response = await Axios.post(`${apiEndpoint}/leaves`,  JSON.stringify(newLeave), {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
  return response.data.item
}

export async function patchLeave(
  idToken: string,
  leaveId: string,
  updatedLeave: UpdateLeaveRequest
): Promise<void> {
  await Axios.patch(`${apiEndpoint}/leaves/${leaveId}`, JSON.stringify(updatedLeave), {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
}

export async function deleteLeave(
  idToken: string,
  leaveId: string
): Promise<void> {
  await Axios.delete(`${apiEndpoint}/leaves/${leaveId}`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
}

export async function getUploadUrl(
  idToken: string,
  leaveId: string
): Promise<string> {
  const response = await Axios.post(`${apiEndpoint}/leaves/${leaveId}/attachment`, '', {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
  return response.data.uploadUrl
}

export async function uploadFile(uploadUrl: string, file: Buffer): Promise<void> {
  await Axios.put(uploadUrl, file)
}
