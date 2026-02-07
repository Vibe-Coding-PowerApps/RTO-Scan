

import React, { useEffect, useState, useContext } from 'react';
import { AuditHistoryTable } from '@/components/audit-history-table';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/ui/select';
import { auditService } from '@/services/auditService';
import type { SignInOutRecord } from '@/types/audit';

// User context for current user info (from App)
const UserContext = React.createContext<{ name: string; email: string; avatar: string }>({ name: '', email: '', avatar: '' });

export default function HistoryPage() {
  const user = useContext(UserContext);
  const [records, setRecords] = useState<SignInOutRecord[]>([]);
  const [pairedRows, setPairedRows] = useState<Array<{ signIn?: SignInOutRecord; signOut?: SignInOutRecord }>>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Month options (could be dynamic)
  const monthOptions = [
    { value: 'all', label: 'All Time' },
    { value: 'feb-2026', label: 'February 2026' },
    { value: 'jan-2026', label: 'January 2026' },
    { value: 'dec-2025', label: 'December 2025' },
  ];

  useEffect(() => {
    setLoading(true);
    auditService.getAuditRecords({
      userEmail: user.email,
    }).then((data) => {
      let filtered = data.filter(r => r.userEmail === user.email);
      if (selectedMonth !== 'all') {
        filtered = filtered.filter((record) => {
          const recordMonth = record.timestamp.getMonth();
          const recordYear = record.timestamp.getFullYear();
          return recordMonth === parseInt(selectedMonth.split('-')[1], 10) - 1 && recordYear === parseInt(selectedMonth.split('-')[0], 10);
        });
      }
      // If no records, use fake demo data
      if (filtered.length === 0) {
        filtered = [
          { id: '1', userId: 'demo-user', userName: user.name, userEmail: user.email, action: 'sign-in', timestamp: new Date('2026-02-07T09:15:00'), status: 'success' },
          { id: '2', userId: 'demo-user', userName: user.name, userEmail: user.email, action: 'sign-out', timestamp: new Date('2026-02-07T17:30:00'), status: 'success' },
          { id: '3', userId: 'demo-user', userName: user.name, userEmail: user.email, action: 'sign-in', timestamp: new Date('2026-02-06T08:45:00'), status: 'success' },
          { id: '4', userId: 'demo-user', userName: user.name, userEmail: user.email, action: 'sign-out', timestamp: new Date('2026-02-06T16:45:00'), status: 'success' },
          { id: '5', userId: 'demo-user', userName: user.name, userEmail: user.email, action: 'sign-in', timestamp: new Date('2026-02-05T09:00:00'), status: 'success' },
          { id: '6', userId: 'demo-user', userName: user.name, userEmail: user.email, action: 'sign-out', timestamp: new Date('2026-02-05T17:00:00'), status: 'success' },
          { id: '7', userId: 'demo-user', userName: user.name, userEmail: user.email, action: 'sign-in', timestamp: new Date('2026-02-04T08:30:00'), status: 'success' },
          { id: '8', userId: 'demo-user', userName: user.name, userEmail: user.email, action: 'sign-out', timestamp: new Date('2026-02-04T17:45:00'), status: 'success' },
          { id: '9', userId: 'demo-user', userName: user.name, userEmail: user.email, action: 'sign-in', timestamp: new Date('2026-02-03T10:20:00'), status: 'success' },
          { id: '10', userId: 'demo-user', userName: user.name, userEmail: user.email, action: 'sign-out', timestamp: new Date('2026-02-03T18:15:00'), status: 'success' },
          { id: '11', userId: 'demo-user', userName: user.name, userEmail: user.email, action: 'sign-in', timestamp: new Date('2026-02-02T09:00:00'), status: 'success' },
          { id: '12', userId: 'demo-user', userName: user.name, userEmail: user.email, action: 'sign-out', timestamp: new Date('2026-02-02T17:00:00'), status: 'success' },
          { id: '13', userId: 'demo-user', userName: user.name, userEmail: user.email, action: 'sign-in', timestamp: new Date('2026-02-01T08:30:00'), status: 'success' },
          { id: '14', userId: 'demo-user', userName: user.name, userEmail: user.email, action: 'sign-out', timestamp: new Date('2026-02-01T17:45:00'), status: 'success' },
          // January 2026
          { id: '15', userId: 'demo-user', userName: user.name, userEmail: user.email, action: 'sign-in', timestamp: new Date('2026-01-31T09:30:00'), status: 'success' },
          { id: '16', userId: 'demo-user', userName: user.name, userEmail: user.email, action: 'sign-out', timestamp: new Date('2026-01-31T17:15:00'), status: 'success' },
          { id: '17', userId: 'demo-user', userName: user.name, userEmail: user.email, action: 'sign-in', timestamp: new Date('2026-01-30T08:50:00'), status: 'success' },
          { id: '18', userId: 'demo-user', userName: user.name, userEmail: user.email, action: 'sign-out', timestamp: new Date('2026-01-30T16:50:00'), status: 'success' },
          { id: '19', userId: 'demo-user', userName: user.name, userEmail: user.email, action: 'sign-in', timestamp: new Date('2026-01-29T10:00:00'), status: 'success' },
          { id: '20', userId: 'demo-user', userName: user.name, userEmail: user.email, action: 'sign-out', timestamp: new Date('2026-01-29T18:00:00'), status: 'success' },
          { id: '21', userId: 'demo-user', userName: user.name, userEmail: user.email, action: 'sign-in', timestamp: new Date('2026-01-28T09:20:00'), status: 'success' },
          { id: '22', userId: 'demo-user', userName: user.name, userEmail: user.email, action: 'sign-out', timestamp: new Date('2026-01-28T17:40:00'), status: 'success' },
          { id: '23', userId: 'demo-user', userName: user.name, userEmail: user.email, action: 'sign-in', timestamp: new Date('2026-01-27T08:30:00'), status: 'success' },
          { id: '24', userId: 'demo-user', userName: user.name, userEmail: user.email, action: 'sign-out', timestamp: new Date('2026-01-27T17:00:00'), status: 'success' },
          // December 2025
          { id: '25', userId: 'demo-user', userName: user.name, userEmail: user.email, action: 'sign-in', timestamp: new Date('2025-12-22T09:00:00'), status: 'success' },
          { id: '26', userId: 'demo-user', userName: user.name, userEmail: user.email, action: 'sign-out', timestamp: new Date('2025-12-22T16:30:00'), status: 'success' },
          { id: '27', userId: 'demo-user', userName: user.name, userEmail: user.email, action: 'sign-in', timestamp: new Date('2025-12-21T09:45:00'), status: 'success' },
          { id: '28', userId: 'demo-user', userName: user.name, userEmail: user.email, action: 'sign-out', timestamp: new Date('2025-12-21T17:30:00'), status: 'success' },
          { id: '29', userId: 'demo-user', userName: user.name, userEmail: user.email, action: 'sign-in', timestamp: new Date('2025-12-20T10:15:00'), status: 'success' },
          { id: '30', userId: 'demo-user', userName: user.name, userEmail: user.email, action: 'sign-out', timestamp: new Date('2025-12-20T18:00:00'), status: 'success' },
        ];
      }
      setRecords(filtered);

      // Pair/group records for pagination
      const grouped: Record<string, SignInOutRecord[]> = {};
      filtered.forEach((rec) => {
        if (!grouped[rec.userId]) grouped[rec.userId] = [];
        grouped[rec.userId].push(rec);
      });
      // For this app, only the current user, so only one group
      const userRecords = Object.values(grouped)[0] || [];
      const sorted = [...userRecords].sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
      let i = 0;
      const rows: Array<{ signIn?: SignInOutRecord; signOut?: SignInOutRecord }> = [];
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
      setPairedRows(rows);
      setLoading(false);
    });
  }, [user.email, selectedMonth]);

  return (
    <div className="fixed inset-0 bg-background flex flex-col items-center w-full overflow-hidden">
      {/* Top Header Bar */}
      <div className="w-full max-w-md flex items-center justify-center px-4 py-4 border-b border-border bg-background">
        <div className="text-lg font-bold">
          <span className="text-foreground">History</span>
        </div>
      </div>
      {/* Scrollable Content Area */}
      <div className="w-full max-w-md flex-1 px-4 py-8 flex flex-col items-center justify-between pb-6">
        <div className="w-full flex-1 flex flex-col items-start justify-start">
          <div className="w-full flex items-start justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold mb-2 text-foreground">Your Scans</h1>
              <p className="text-sm text-muted-foreground">Track your office attendance</p>
            </div>
            <Select value={selectedMonth} onValueChange={setSelectedMonth}>
              <SelectTrigger className="w-40" aria-label="Select month">
                <SelectValue placeholder="Select month" />
              </SelectTrigger>
              <SelectContent>
                {monthOptions.map(opt => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="w-full max-w-md min-h-[420px] overflow-x-auto rounded-lg bg-card border border-border shadow-sm mb-4 flex flex-col justify-start">
            <AuditHistoryTable
              records={pairedRows.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)}
              loading={loading}
              hideEmail
            />
          </div>
          {/* Pagination Controls */}
          {records.length > itemsPerPage && (
            <div className="w-full flex flex-wrap items-center justify-center gap-2 mt-2 pt-2 border-t border-border px-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                className="px-2 sm:px-3 py-1 sm:py-2 h-7 sm:h-8 text-xs whitespace-nowrap rounded border border-border bg-card text-foreground disabled:opacity-50"
                disabled={currentPage === 1}
              >
                ← Prev
              </button>
              <div className="flex items-center gap-1 flex-wrap justify-center">
                {Array.from({ length: Math.ceil(records.length / itemsPerPage) }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-6 h-6 sm:w-7 sm:h-7 rounded-lg transition-colors text-xs font-medium flex items-center justify-center ${
                      currentPage === page
                        ? 'bg-primary text-primary-foreground'
                        : 'text-foreground hover:bg-card border border-border'
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>
              <button
                onClick={() => setCurrentPage(Math.min(Math.ceil(records.length / itemsPerPage), currentPage + 1))}
                className="px-2 sm:px-3 py-1 sm:py-2 h-7 sm:h-8 text-xs whitespace-nowrap rounded border border-border bg-card text-foreground disabled:opacity-50"
                disabled={currentPage === Math.ceil(records.length / itemsPerPage)}
              >
                Next →
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
