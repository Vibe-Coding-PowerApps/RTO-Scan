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
  pairs: Array<{ signIn?: SignInOutRecord; signOut?: SignInOutRecord }>
  loading?: boolean
  hideEmail?: boolean
}

export function AuditHistoryTable({ pairs, loading = false, hideEmail = false }: AuditHistoryTableProps) {
  if (loading) {
    return (
      <div className="space-y-2 w-full">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-12 w-full" />
        ))}
      </div>
    )
  }

  if (pairs.length === 0) {
    return (
      <div className="flex items-center justify-center h-32 text-muted-foreground">
        No audit records found
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead className="w-12">Action</TableHead>
            {/* <TableHead>User Name</TableHead> */}
            {!hideEmail && <TableHead>Email</TableHead>}
            <TableHead>Sign In</TableHead>
            <TableHead>Sign Out</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {pairs.map((pair, idx) => (
            <TableRow key={pair.signIn?.id || pair.signOut?.id || idx} className="hover:bg-muted/50">
              <TableCell className="w-12">
                {pair.signIn ? (
                  <div className="flex items-center justify-center">
                    <IconLogin className="h-4 w-4 text-green-600" />
                  </div>
                ) : pair.signOut ? (
                  <div className="flex items-center justify-center">
                    <IconLogout className="h-4 w-4 text-red-600" />
                  </div>
                ) : null}
              </TableCell>
              {/* <TableCell className="font-medium">{pair.signIn?.userName || pair.signOut?.userName}</TableCell> */}
              {!hideEmail && (
                <TableCell className="text-sm text-muted-foreground">{pair.signIn?.userEmail || pair.signOut?.userEmail}</TableCell>
              )}
              <TableCell className="text-sm">{pair.signIn ? new Date(pair.signIn.timestamp).toLocaleString() : '-'}</TableCell>
              <TableCell className="text-sm">{pair.signOut ? new Date(pair.signOut.timestamp).toLocaleString() : '-'}</TableCell>
              <TableCell>
                <Badge variant={(pair.signIn?.status || pair.signOut?.status) === 'success' ? 'default' : 'destructive'}>
                  {pair.signIn?.status || pair.signOut?.status}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
