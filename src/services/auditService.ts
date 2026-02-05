/**
 * Audit Service
 * Handles user sign-in/out history tracking and retrieval
 */

import type { SignInOutRecord, AuditSummary, FilterOptions } from '@/types/audit'

// Mock data - Replace with actual API calls or database integration
const MOCK_AUDIT_RECORDS: SignInOutRecord[] = [
  {
    id: '1',
    userId: 'user-001',
    userName: 'John Doe',
    userEmail: 'john.doe@example.com',
    action: 'sign-in',
    timestamp: new Date(new Date().setDate(new Date().getDate() - 7)),
    ipAddress: '192.168.1.100',
    deviceInfo: 'Windows 10 Chrome',
    status: 'success',
  },
  {
    id: '2',
    userId: 'user-001',
    userName: 'John Doe',
    userEmail: 'john.doe@example.com',
    action: 'sign-out',
    timestamp: new Date(new Date().setDate(new Date().getDate() - 7)),
    status: 'success',
  },
  {
    id: '3',
    userId: 'user-002',
    userName: 'Jane Smith',
    userEmail: 'jane.smith@example.com',
    action: 'sign-in',
    timestamp: new Date(new Date().setDate(new Date().getDate() - 6)),
    ipAddress: '192.168.1.101',
    deviceInfo: 'MacOS Safari',
    status: 'success',
  },
  {
    id: '4',
    userId: 'user-002',
    userName: 'Jane Smith',
    userEmail: 'jane.smith@example.com',
    action: 'sign-out',
    timestamp: new Date(new Date().setDate(new Date().getDate() - 6)),
    status: 'success',
  },
  {
    id: '5',
    userId: 'user-003',
    userName: 'Bob Johnson',
    userEmail: 'bob.johnson@example.com',
    action: 'sign-in',
    timestamp: new Date(new Date().setDate(new Date().getDate() - 5)),
    ipAddress: '192.168.1.102',
    deviceInfo: 'Windows 11 Edge',
    status: 'success',
  },
  {
    id: '6',
    userId: 'user-001',
    userName: 'John Doe',
    userEmail: 'john.doe@example.com',
    action: 'sign-in',
    timestamp: new Date(new Date().setDate(new Date().getDate() - 3)),
    ipAddress: '192.168.1.103',
    deviceInfo: 'iPhone Safari',
    status: 'success',
  },
]

class AuditService {
  /**
   * Fetch all audit records with optional filters
   */
  async getAuditRecords(filters?: FilterOptions): Promise<SignInOutRecord[]> {
    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500))

      let records = [...MOCK_AUDIT_RECORDS]

      // Apply filters
      if (filters) {
        if (filters.userId) {
          records = records.filter((r) => r.userId === filters.userId)
        }
        if (filters.userName) {
          records = records.filter((r) =>
            r.userName.toLowerCase().includes(filters.userName!.toLowerCase())
          )
        }
        if (filters.action && filters.action !== 'all') {
          records = records.filter((r) => r.action === filters.action)
        }
        if (filters.status && filters.status !== 'all') {
          records = records.filter((r) => r.status === filters.status)
        }
        if (filters.dateFrom) {
          records = records.filter((r) => new Date(r.timestamp) >= filters.dateFrom!)
        }
        if (filters.dateTo) {
          records = records.filter((r) => new Date(r.timestamp) <= filters.dateTo!)
        }
      }

      // Sort by timestamp descending
      records.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())

      return records
    } catch (error) {
      console.error('Error fetching audit records:', error)
      throw error
    }
  }

  /**
   * Get audit summary statistics
   */
  async getAuditSummary(dateRange?: { start: Date; end: Date }): Promise<AuditSummary> {
    try {
      const records = await this.getAuditRecords()

      let filteredRecords = records
      if (dateRange) {
        filteredRecords = records.filter(
          (r) =>
            new Date(r.timestamp) >= dateRange.start &&
            new Date(r.timestamp) <= dateRange.end
        )
      }

      const uniqueUsers = new Set(filteredRecords.map((r) => r.userId))

      return {
        totalSignIns: filteredRecords.filter((r) => r.action === 'sign-in').length,
        totalSignOuts: filteredRecords.filter((r) => r.action === 'sign-out').length,
        uniqueUsers: uniqueUsers.size,
        dateRange: dateRange || {
          start: new Date(new Date().setDate(new Date().getDate() - 30)),
          end: new Date(),
        },
      }
    } catch (error) {
      console.error('Error fetching audit summary:', error)
      throw error
    }
  }

  /**
   * Log a sign-in event
   */
  async logSignIn(
    userId: string,
    userName: string,
    userEmail: string,
    ipAddress?: string,
    deviceInfo?: string
  ): Promise<SignInOutRecord> {
    try {
      const record: SignInOutRecord = {
        id: `${Date.now()}-${Math.random()}`,
        userId,
        userName,
        userEmail,
        action: 'sign-in',
        timestamp: new Date(),
        ipAddress,
        deviceInfo,
        status: 'success',
      }

      MOCK_AUDIT_RECORDS.push(record)
      return record
    } catch (error) {
      console.error('Error logging sign-in:', error)
      throw error
    }
  }

  /**
   * Log a sign-out event
   */
  async logSignOut(userId: string): Promise<SignInOutRecord> {
    try {
      // Find the user's last sign-in record to get their details
      const lastSignIn = MOCK_AUDIT_RECORDS.find(
        (r) => r.userId === userId && r.action === 'sign-in'
      )

      const record: SignInOutRecord = {
        id: `${Date.now()}-${Math.random()}`,
        userId,
        userName: lastSignIn?.userName || 'Unknown User',
        userEmail: lastSignIn?.userEmail || 'unknown@example.com',
        action: 'sign-out',
        timestamp: new Date(),
        status: 'success',
      }

      MOCK_AUDIT_RECORDS.push(record)
      return record
    } catch (error) {
      console.error('Error logging sign-out:', error)
      throw error
    }
  }

  /**
   * Export audit records as CSV
   */
  async exportAsCsv(records: SignInOutRecord[]): Promise<string> {
    const headers = [
      'ID',
      'User ID',
      'User Name',
      'User Email',
      'Action',
      'Timestamp',
      'IP Address',
      'Device Info',
      'Status',
    ]

    const rows = records.map((record) => [
      record.id,
      record.userId,
      record.userName,
      record.userEmail,
      record.action,
      new Date(record.timestamp).toISOString(),
      record.ipAddress || '',
      record.deviceInfo || '',
      record.status,
    ])

    const csv = [headers, ...rows].map((row) => row.map((cell) => `"${cell}"`).join(','))

    return csv.join('\n')
  }
}

export const auditService = new AuditService()
