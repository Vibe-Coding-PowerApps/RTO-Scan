# Audit History Feature

## Overview
The Audit History feature provides a comprehensive way to track and monitor all user sign-in and sign-out activities for security, compliance, and organizational auditing purposes.

## Features

### 1. **Sign-In/Out Tracking**
   - Records all user authentication events (sign-in and sign-out)
   - Captures timestamp, user information, IP address, and device details
   - Tracks success/failure status of authentication attempts

### 2. **Audit Dashboard**
   - Summary statistics showing:
     - Total sign-ins in the current period
     - Total sign-outs in the current period
     - Number of unique users
     - Date range of records

### 3. **Advanced Filtering**
   - Filter by user name
   - Filter by action type (sign-in, sign-out, or all)
   - Filter by status (success, failed, or all)
   - Date range filtering (for future enhancement)

### 4. **Historical Data Table**
   - Displays all audit records in a sortable table
   - Shows: Action icon, user name, email, timestamp, IP address, device info, and status
   - Visual indicators for sign-in (green) and sign-out (red) actions
   - Color-coded status badges

### 5. **Export Functionality**
   - Export audit records to CSV format
   - Includes all record details for external analysis
   - Timestamped file naming for organization

### 6. **Real-time Refresh**
   - Refresh button to reload the latest audit data
   - Automatic loading states and error handling

## File Structure

```
src/
├── app/
│   └── audit-history/
│       └── page.tsx                 # Main audit history page component
├── components/
│   └── audit-history-table.tsx      # Audit history data table component
├── services/
│   └── auditService.ts              # Service for audit operations
└── types/
    └── audit.ts                     # TypeScript types and interfaces
```

## Components

### AuditHistoryPage (`src/app/audit-history/page.tsx`)
Main page component that orchestrates the audit history UI with:
- Summary statistics cards
- Filter controls
- Data table display
- Export functionality
- Refresh mechanism

**Props**: None (uses hooks for state management)

**Key Features**:
- Real-time data fetching
- Filter state management
- CSV export
- Loading states

### AuditHistoryTable (`src/components/audit-history-table.tsx`)
Displays audit records in a structured table format.

**Props**:
- `records: SignInOutRecord[]` - Array of audit records to display
- `loading?: boolean` - Loading state indicator (default: false)

**Displays**:
- Action (sign-in/out icons)
- User name
- Email
- Timestamp
- IP address
- Device information
- Status badge

## Services

### AuditService (`src/services/auditService.ts`)
Core service class handling all audit-related operations:

**Methods**:

#### `getAuditRecords(filters?: FilterOptions): Promise<SignInOutRecord[]>`
Fetches audit records with optional filtering.

**Parameters**:
- `filters` (optional):
  - `userId`: Filter by specific user ID
  - `userName`: Filter by user name (substring match)
  - `action`: Filter by action type ('sign-in' | 'sign-out')
  - `dateFrom`: Filter records from a specific date
  - `dateTo`: Filter records to a specific date
  - `status`: Filter by status ('success' | 'failed')

**Returns**: Promise resolving to array of filtered and sorted records

#### `getAuditSummary(dateRange?: {start: Date; end: Date}): Promise<AuditSummary>`
Retrieves summary statistics for the specified date range.

**Returns**: AuditSummary object with:
- `totalSignIns`: Number of sign-in events
- `totalSignOuts`: Number of sign-out events
- `uniqueUsers`: Count of unique users
- `dateRange`: The date range of the summary

#### `logSignIn(userId, userName, userEmail, ipAddress?, deviceInfo?): Promise<SignInOutRecord>`
Records a new sign-in event.

**Returns**: Created SignInOutRecord

#### `logSignOut(userId): Promise<SignInOutRecord>`
Records a new sign-out event.

**Returns**: Created SignInOutRecord

#### `exportAsCsv(records: SignInOutRecord[]): Promise<string>`
Converts records to CSV format.

**Returns**: CSV string representation of records

## Types

### SignInOutRecord
```typescript
{
  id: string                    // Unique record ID
  userId: string                // User identifier
  userName: string              // User's display name
  userEmail: string             // User's email address
  action: 'sign-in' | 'sign-out' // Action type
  timestamp: Date               // When the action occurred
  ipAddress?: string            // Source IP address
  deviceInfo?: string           // Device/browser information
  location?: string             // Geographic location (optional)
  status: 'success' | 'failed'   // Action result
  notes?: string                // Additional notes
}
```

### AuditSummary
```typescript
{
  totalSignIns: number          // Count of sign-in events
  totalSignOuts: number         // Count of sign-out events
  uniqueUsers: number           // Count of unique users
  dateRange: {
    start: Date
    end: Date
  }
}
```

### FilterOptions
```typescript
{
  userId?: string               // Filter by user ID
  userName?: string             // Filter by user name
  action?: 'sign-in' | 'sign-out' | 'all'
  dateFrom?: Date               // Filter from date
  dateTo?: Date                 // Filter to date
  status?: 'success' | 'failed' | 'all'
}
```

## Navigation Integration

The Audit History feature is integrated into the main navigation sidebar:
- Menu item: "Audit History"
- Icon: History icon (from Tabler Icons)
- Route: `/app/audit-history`
- Accessible from all pages via the main sidebar

## Current Implementation

The current implementation uses **mock data** for demonstration purposes. The mock data includes:
- Multiple user sign-in/out events
- Varying timestamps over the past 7 days
- Realistic user information and device details

## Future Enhancements

To use this feature with real data, you'll need to:

1. **Replace Mock Data**: Replace the `MOCK_AUDIT_RECORDS` array in `AuditService` with actual API calls or database queries

2. **Integration Points**:
   ```typescript
   // Replace in auditService.ts
   // Instead of using MOCK_AUDIT_RECORDS, call your backend:
   const response = await fetch('/api/audit-history', { /* config */ })
   const records = await response.json()
   ```

3. **Real-Time Logging**: Integrate `auditService.logSignIn()` and `auditService.logSignOut()` into your authentication flow:
   ```typescript
   // When user logs in:
   await auditService.logSignIn(userId, userName, email, ipAddress, deviceInfo)
   
   // When user logs out:
   await auditService.logSignOut(userId)
   ```

4. **Enhanced Filtering**: Implement date range filtering in the filter UI

5. **Pagination**: Add pagination for large datasets

6. **Advanced Analytics**: Add charts and insights based on audit data

## Usage Example

### Accessing the Audit History
1. Click on "Audit History" in the main sidebar
2. View summary statistics at the top
3. Use filters to narrow down results
4. Export data as needed

### For Developers Integrating Real Data

```typescript
// In your authentication service
import { auditService } from '@/services/auditService'

// Log sign-in event
await auditService.logSignIn(
  currentUser.id,
  currentUser.name,
  currentUser.email,
  clientIpAddress,
  `${navigator.userAgent}`
)

// Log sign-out event
await auditService.logSignOut(currentUser.id)
```

## Compliance & Security

This audit history feature supports:
- **Compliance Reporting**: Track all user access for regulatory requirements
- **Security Monitoring**: Identify suspicious login patterns
- **Accountability**: Maintain a complete audit trail
- **Access Control**: Export data for further analysis

## Notes

- Records are sorted by timestamp in descending order (most recent first)
- All timestamps are converted to local timezone for display
- Status badges use color coding (green for success, red for failure)
- CSV export includes all record fields with proper formatting
- Mock data is refreshed on page load for demonstration
