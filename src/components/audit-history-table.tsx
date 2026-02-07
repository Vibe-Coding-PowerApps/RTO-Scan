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
  hideEmail?: boolean
}

export function AuditHistoryTable({ records, loading = false, hideEmail = false }: AuditHistoryTableProps) {
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
          {/* Group records by user and pair sign-in/sign-out */}
          {(() => {
            // Group by userId, then pair sign-in and sign-out
            const grouped: Record<string, SignInOutRecord[]> = {};
            records.forEach((rec) => {
              if (!grouped[rec.userId]) grouped[rec.userId] = [];
              grouped[rec.userId].push(rec);
            });
            // For each user, pair sign-in and sign-out by timestamp order
            const rows: Array<{
              signIn?: SignInOutRecord;
              signOut?: SignInOutRecord;
            }> = [];
            Object.values(grouped).forEach((userRecords) => {
              const sorted = [...userRecords].sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
              let i = 0;
              while (i < sorted.length) {
                if (sorted[i].action === 'sign-in') {
                  const signIn = sorted[i];
                  let signOut: SignInOutRecord | undefined = undefined;
                  if (i + 1 < sorted.length && sorted[i + 1].action === 'sign-out') {
                    signOut = sorted[i + 1];
                    i += 2;
                  } else {
                    i += 1;
                  }
                  rows.push({ signIn, signOut });
                } else {
                  // orphan sign-out
                  rows.push({ signOut: sorted[i] });
                  i += 1;
                }
              }
            });
            return rows.map((pair, idx) => (
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
            ));
          })()}
        </TableBody>
      </Table>
    </div>
  )
}
