/**
 * Audit History Types
 * Defines data structures for tracking user sign-in/out activity
 */

export interface SignInOutRecord {
  id: string
  userId: string
  userName: string
  userEmail: string
  action: 'sign-in' | 'sign-out'
  timestamp: Date
  ipAddress?: string
  deviceInfo?: string
  location?: string
  status: 'success' | 'failed'
  notes?: string
}

export interface AuditSummary {
  totalSignIns: number
  totalSignOuts: number
  uniqueUsers: number
  dateRange: {
    start: Date
    end: Date
  }
}

export interface FilterOptions {
  userId?: string
  userName?: string
  userEmail?: string
  action?: 'sign-in' | 'sign-out' | 'all'
  dateFrom?: Date
  dateTo?: Date
  status?: 'success' | 'failed' | 'all'
}
