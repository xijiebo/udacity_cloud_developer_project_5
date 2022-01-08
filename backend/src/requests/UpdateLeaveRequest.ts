/**
 * Fields in a request to update a single LEAVE item.
 */
export interface UpdateLeaveRequest {
  name: string
  dueDate: string
  done: boolean
}