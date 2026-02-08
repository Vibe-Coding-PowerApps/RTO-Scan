import { useState } from 'react';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem
} from '@/ui/select';

type Desk = { id: string; occupied: boolean };
const floors: { [key: string]: Desk[] } = {
  '1': Array.from({ length: 108 }, (_, i) => ({ id: `D-${101 + i}`, occupied: [5, 12, 19, 28, 35, 44, 52, 61, 69, 78, 85, 94, 105].includes(i) })),
  '2': Array.from({ length: 108 }, (_, i) => ({ id: `D-${201 + i}`, occupied: [3, 11, 18, 27, 34, 42, 51, 60, 67, 76, 83, 92, 103].includes(i) })),
  '3': Array.from({ length: 108 }, (_, i) => ({ id: `D-${301 + i}`, occupied: [4, 13, 21, 29, 36, 45, 53, 62, 70, 79, 86, 95, 106].includes(i) })),
  '4': Array.from({ length: 108 }, (_, i) => ({ id: `D-${401 + i}`, occupied: [6, 14, 22, 30, 37, 46, 54, 63, 71, 80, 87, 96, 108].includes(i) })),
};

export default function FloorMapPage() {
  // State for floor selection and pagination
  const [selectedFloor, setSelectedFloor] = useState('1');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 16;
  return (
    <div className="fixed inset-0 bg-background flex flex-col items-center w-full overflow-hidden">
      {/* Top Header Bar */}
      <div className="w-full max-w-md flex items-center justify-center px-4 py-4 border-b border-border bg-background">
        <div className="text-lg font-bold">
          <span className="text-foreground">Floor Map</span>
        </div>
      </div>
      {/* Content Area - Scrollable, like History */}
      <div className="w-full max-w-md flex-1 px-4 py-8 flex flex-col items-center justify-between pb-6">
        <div className="w-full flex-1 flex flex-col items-start justify-start">
          <div className="w-full flex items-start justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold mb-2 text-foreground">Floor Map</h1>
              <p className="text-sm text-muted-foreground">View desk availability</p>
            </div>
            <Select value={selectedFloor} onValueChange={value => {
              setSelectedFloor(value);
              setCurrentPage(1);
            }}>
              <SelectTrigger className="w-40" aria-label="Select floor">
                <SelectValue placeholder="Select floor" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">Floor 1</SelectItem>
                <SelectItem value="2">Floor 2</SelectItem>
                <SelectItem value="3">Floor 3</SelectItem>
                <SelectItem value="4">Floor 4</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {/* Metric Cards */}
          <div className="w-full grid grid-cols-2 gap-2 mb-4">
            {/* Total Desks */}
            <div className="bg-card border border-border rounded-lg p-2">
              <p className="text-[11px] text-muted-foreground mb-1">Total Desks</p>
              <div className="flex items-center justify-between mb-1">
                <span className="text-2xl font-bold text-foreground">66</span>
                <span className="text-[10px] text-foreground bg-muted px-1.5 py-0.5 rounded-full">↗ +8.2%</span>
              </div>
              <p className="text-[11px] text-foreground mb-0.5">Desk availability increased</p>
              <p className="text-[10px] text-muted-foreground">Available on floor</p>
            </div>
            {/* Occupied */}
            <div className="bg-card border border-border rounded-lg p-2">
              <p className="text-[11px] text-muted-foreground mb-1">Occupied</p>
              <div className="flex items-center justify-between mb-1">
                <span className="text-2xl font-bold text-foreground">49</span>
                <span className="text-[10px] text-foreground bg-muted px-1.5 py-0.5 rounded-full">↙ -5.1%</span>
              </div>
              <p className="text-[11px] text-foreground mb-0.5">Moderate desk utilization</p>
              <p className="text-[10px] text-muted-foreground">Desks in use</p>
            </div>
            {/* Available */}
            <div className="bg-card border border-border rounded-lg p-2">
              <p className="text-[11px] text-muted-foreground mb-1">Available</p>
              <div className="flex items-center justify-between mb-1">
                <span className="text-2xl font-bold text-foreground">17</span>
                <span className="text-[10px] text-foreground bg-muted px-1.5 py-0.5 rounded-full">↗ +12.5%</span>
              </div>
              <p className="text-[11px] text-foreground mb-0.5">Strong desk availability</p>
              <p className="text-[10px] text-muted-foreground">Ready to use</p>
            </div>
            {/* Occupancy Rate */}
            <div className="bg-card border border-border rounded-lg p-2">
              <p className="text-[11px] text-muted-foreground mb-1">Occupancy Rate</p>
              <div className="flex items-center justify-between mb-1">
                <span className="text-2xl font-bold text-foreground">74%</span>
                <span className="text-[10px] text-foreground bg-muted px-1.5 py-0.5 rounded-full">↗ +3.8%</span>
              </div>
              <p className="text-[11px] text-foreground mb-0.5">Steady utilization growth</p>
              <p className="text-[10px] text-muted-foreground">Floor utilization</p>
            </div>
          </div>
          <div className="w-full max-w-md overflow-x-auto rounded-lg bg-card border border-border shadow-sm mb-4 flex flex-col justify-between" style={{ minHeight: 0 }}>
            {/* Desk Grid */}
            <div className="grid grid-cols-4 gap-1.5 p-4">
              {(() => {
                const allDesks = floors[selectedFloor] || [];
                const startIdx = (currentPage - 1) * itemsPerPage;
                const paginatedDesks = allDesks.slice(startIdx, startIdx + itemsPerPage);
                return paginatedDesks.map((desk) => (
                  <div
                    key={desk.id}
                    className={`flex flex-col items-center justify-center gap-0.5 p-1.5 rounded border-2 transition-all cursor-pointer text-xs font-medium min-h-[38px] ${desk.occupied ? 'bg-destructive/15 border-destructive text-destructive hover:bg-destructive/25' : 'bg-accent/15 border-accent text-accent-foreground hover:bg-accent/25'}`}
                  >
                    <span>{desk.id.split('-')[1]}</span>
                    <span className={`${desk.occupied ? 'text-destructive' : 'text-accent'}`}>{desk.occupied ? '●' : '◯'}</span>
                  </div>
                ));
              })()}
            </div>
          </div>
          {/* Legend */}
          <div className="w-full flex items-center justify-center gap-3 mb-1">
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-accent border border-accent"></div>
              <span className="text-xs text-foreground">Available</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-destructive border border-destructive"></div>
              <span className="text-xs text-foreground">Occupied</span>
            </div>
          </div>
          {/* Pagination Controls */}
          {(() => {
            const allDesks = floors[selectedFloor] || [];
            const totalPages = Math.ceil(allDesks.length / itemsPerPage);
            return (
              <div className="w-full flex flex-wrap items-center justify-center gap-2 mt-2 pt-2 border-t border-border px-2">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  className="px-2 sm:px-3 py-1 sm:py-2 h-7 sm:h-8 text-xs whitespace-nowrap rounded border border-border bg-card text-foreground disabled:opacity-50"
                  disabled={currentPage === 1}
                >
                  ← Prev
                </button>
                <div className="flex items-center gap-1 flex-wrap justify-center">
                  {(() => {
                    let start = 1;
                    let end = totalPages;
                    if (totalPages > 3) {
                      if (currentPage <= 2) {
                        start = 1;
                        end = 3;
                      } else if (currentPage >= totalPages - 1) {
                        start = totalPages - 2;
                        end = totalPages;
                      } else {
                        start = currentPage - 1;
                        end = currentPage + 1;
                      }
                    }
                    return Array.from({ length: end - start + 1 }, (_, i) => start + i).map((page) => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`w-6 h-6 sm:w-7 sm:h-7 rounded-lg transition-colors text-xs font-medium flex items-center justify-center ${currentPage === page ? 'bg-primary text-primary-foreground' : 'text-foreground hover:bg-card border border-border'}`}
                      >
                        {page}
                      </button>
                    ));
                  })()}
                </div>
                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  className="px-2 sm:px-3 py-1 sm:py-2 h-7 sm:h-8 text-xs whitespace-nowrap rounded border border-border bg-card text-foreground disabled:opacity-50"
                  disabled={currentPage === totalPages}
                >
                  Next →
                </button>
              </div>
            );
          })()}
        </div>
      </div>
    </div>
  );
}
