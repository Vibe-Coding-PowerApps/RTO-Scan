'use client'

import { useState, useEffect } from 'react'
import {
  IconDownload,
  IconFilter,
  IconRefresh,
  IconLogin,
  IconLogout,
} from '@tabler/icons-react'
import { Button } from '@/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/ui/card'
import { Input } from '@/ui/input'
import { Label } from '@/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/ui/select'
import { SidebarInset } from '@/ui/sidebar'
import type { SignInOutRecord, FilterOptions, AuditSummary } from '@/types/audit'
import { auditService } from '@/services/auditService'
import { AuditHistoryTable } from '@/components/audit-history-table'
import { toast } from 'sonner'

export default function AuditHistoryPage() {
  const [records, setRecords] = useState<SignInOutRecord[]>([])
  const [summary, setSummary] = useState<AuditSummary | null>(null)
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState<FilterOptions>({
    action: 'all',
    status: 'all',
  })

  // Load data on mount and when filters change
  useEffect(() => {
    loadData()
  }, [filters])

  const loadData = async () => {
    setLoading(true)
    try {
      const [auditRecords, auditSummary] = await Promise.all([
        auditService.getAuditRecords(filters),
        auditService.getAuditSummary(),
      ])
      setRecords(auditRecords)
      setSummary(auditSummary)
    } catch (error) {
      toast.error('Failed to load audit history')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleFilterChange = (key: keyof FilterOptions, value: any) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value || undefined,
    }))
  }

  const handleExport = async () => {
    try {
      const csv = await auditService.exportAsCsv(records)
      const element = document.createElement('a')
      const file = new Blob([csv], { type: 'text/csv' })
      element.href = URL.createObjectURL(file)
      element.download = `audit-history-${new Date().toISOString().split('T')[0]}.csv`
      document.body.appendChild(element)
      element.click()
      document.body.removeChild(element)
      toast.success('Audit history exported successfully')
    } catch (error) {
      toast.error('Failed to export audit history')
      console.error(error)
    }
  }

  const handleRefresh = () => {
    loadData()
    toast.success('Audit history refreshed')
  }

  return (
    <SidebarInset>
      <div className="flex flex-col h-full w-full p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Audit History</h1>
          <p className="text-muted-foreground">
            Track and monitor all user sign-in and sign-out activities for security and compliance.
          </p>
        </div>

        {/* Summary Cards */}
        {summary && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Sign-Ins</CardTitle>
                <IconLogin className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{summary.totalSignIns}</div>
                <p className="text-xs text-muted-foreground">
                  {summary.dateRange.start.toLocaleDateString()} -{' '}
                  {summary.dateRange.end.toLocaleDateString()}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Sign-Outs</CardTitle>
                <IconLogout className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{summary.totalSignOuts}</div>
                <p className="text-xs text-muted-foreground">
                  {summary.dateRange.start.toLocaleDateString()} -{' '}
                  {summary.dateRange.end.toLocaleDateString()}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Unique Users</CardTitle>
                <IconFilter className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{summary.uniqueUsers}</div>
                <p className="text-xs text-muted-foreground">
                  {summary.dateRange.start.toLocaleDateString()} -{' '}
                  {summary.dateRange.end.toLocaleDateString()}
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Filters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label htmlFor="username">User Name</Label>
                <Input
                  id="username"
                  placeholder="Search by name..."
                  value={filters.userName || ''}
                  onChange={(e) => handleFilterChange('userName', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="action">Action</Label>
                <Select
                  value={filters.action || 'all'}
                  onValueChange={(value: string) =>
                    handleFilterChange('action', value === 'all' ? undefined : value)
                  }
                >
                  <SelectTrigger id="action">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Actions</SelectItem>
                    <SelectItem value="sign-in">Sign In</SelectItem>
                    <SelectItem value="sign-out">Sign Out</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={filters.status || 'all'}
                  onValueChange={(value: string) =>
                    handleFilterChange('status', value === 'all' ? undefined : value)
                  }
                >
                  <SelectTrigger id="status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="success">Success</SelectItem>
                    <SelectItem value="failed">Failed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-end gap-2">
                <Button
                  onClick={handleRefresh}
                  variant="outline"
                  size="icon"
                  className="h-10 w-10"
                  title="Refresh"
                >
                  <IconRefresh className="h-4 w-4" />
                </Button>
                <Button
                  onClick={handleExport}
                  variant="outline"
                  size="icon"
                  className="h-10 w-10"
                  title="Export as CSV"
                >
                  <IconDownload className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Audit History Table */}
        <Card className="flex-1 flex flex-col">
          <CardHeader>
            <CardTitle className="text-base">Sign-In/Out History</CardTitle>
            <CardDescription>
              Total Records: {records.length}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1 overflow-auto">
            <AuditHistoryTable records={records} loading={loading} />
          </CardContent>
        </Card>
      </div>
    </SidebarInset>
  )
}
