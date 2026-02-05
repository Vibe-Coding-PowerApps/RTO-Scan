'use client'

import type { SignInOutRecord } from '@/types/audit'
import { Badge } from '@/ui/badge'
import { Skeleton } from '@/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/ui/table'
import { IconLogin, IconLogout } from '@tabler/icons-react'

interface AuditHistoryTableProps {
  records: SignInOutRecord[]
  loading?: boolean
}

export function AuditHistoryTable({ records, loading = false }: AuditHistoryTableProps) {
  if (loading) {
    return (
      <div className="space-y-2 w-full">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-12 w-full" />
        ))}
      </div>
    )
  }

  if (records.length === 0) {
    return (
      <div className="flex items-center justify-center h-32 text-muted-foreground">
        No audit records found
      </div>
    )
  }

  return (
    <div className="border rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead className="w-12">Action</TableHead>
            <TableHead>User Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Timestamp</TableHead>
            <TableHead>IP Address</TableHead>
            <TableHead>Device</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {records.map((record) => (
            <TableRow key={record.id} className="hover:bg-muted/50">
              <TableCell className="w-12">
                {record.action === 'sign-in' ? (
                  <div className="flex items-center justify-center">
                    <IconLogin className="h-4 w-4 text-green-600" />
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    <IconLogout className="h-4 w-4 text-red-600" />
                  </div>
                )}
              </TableCell>
              <TableCell className="font-medium">{record.userName}</TableCell>
              <TableCell className="text-sm text-muted-foreground">{record.userEmail}</TableCell>
              <TableCell className="text-sm">
                {new Date(record.timestamp).toLocaleString()}
              </TableCell>
              <TableCell className="text-sm text-muted-foreground font-mono">
                {record.ipAddress || '-'}
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {record.deviceInfo || '-'}
              </TableCell>
              <TableCell>
                <Badge variant={record.status === 'success' ? 'default' : 'destructive'}>
                  {record.status}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
