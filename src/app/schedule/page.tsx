import React, { useState } from 'react';

export default function SchedulePage() {
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [currentCalendarMonth, setCurrentCalendarMonth] = useState(new Date());
  const [isDraggingDates, setIsDraggingDates] = useState(false);
  const [dragStartDate, setDragStartDate] = useState<string | null>(null);
  const [draggedDates, setDraggedDates] = useState<string[]>([]);
  const [dragStartX, setDragStartX] = useState(0);
  const [dragStartY, setDragStartY] = useState(0);

  return (
    <div className="fixed inset-0 bg-background flex flex-col items-center w-full overflow-hidden">
      {/* Top Header Bar */}
      <div className="w-full max-w-md flex items-center justify-center px-4 py-4 border-b border-border bg-background">
        <div className="text-lg font-bold">
          <span className="text-foreground">Schedule</span>
        </div>
      </div>
      {/* Scrollable Content Area */}
      <div className="w-full max-w-md flex-1 px-4 py-8 flex flex-col items-center justify-between pb-6">
        <div className="w-full flex-1 flex flex-col items-start justify-start">
          <div className="w-full flex items-start justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold mb-2 text-foreground">Office Schedule</h1>
              <p className="text-sm text-muted-foreground">View and manage your work schedule</p>
            </div>
          </div>
          <div className="w-full max-w-md min-h-[420px] overflow-visible rounded-lg bg-card shadow-sm mb-4 flex flex-col justify-start">
            {/* Month Navigation */}
            <div className="flex items-center justify-between mb-6 gap-3">
              <button
                onClick={() => setCurrentCalendarMonth(new Date(currentCalendarMonth.getFullYear(), currentCalendarMonth.getMonth() - 1, 1))}
                className="flex-shrink-0 h-10 w-10 p-2 rounded-lg border border-border bg-card hover:bg-accent text-foreground transition-colors flex items-center justify-center"
                aria-label="Previous month"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <div className="text-center flex-1">
                <p className="text-lg font-semibold text-foreground">
                  {currentCalendarMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </p>
              </div>
              <button
                onClick={() => setCurrentCalendarMonth(new Date(currentCalendarMonth.getFullYear(), currentCalendarMonth.getMonth() + 1, 1))}
                className="flex-shrink-0 h-10 w-10 p-2 rounded-lg border border-border bg-card hover:bg-accent text-foreground transition-colors flex items-center justify-center"
                aria-label="Next month"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            {/* Calendar Grid */}
            <div
              className="bg-card border border-border rounded-lg p-4 mb-6 space-y-3 select-none"
              onTouchStart={(e) => {
                const touch = e.touches[0];
                setDragStartX(touch.clientX);
                setDragStartY(touch.clientY);

                // Find the button element that was touched
                let element: HTMLElement | null = e.target as HTMLElement;
                while (element && element.tagName !== 'BUTTON') {
                  element = element.parentElement;
                }

                const dateAttr = element?.getAttribute('data-date');
                if (dateAttr && element?.tagName === 'BUTTON') {
                  setDragStartDate(dateAttr);
                  setDraggedDates([]);
                }
              }}
              onTouchMove={(e) => {
                if (!dragStartDate) return;

                const touch = e.touches[0];
                const moveDistance = Math.sqrt(
                  Math.pow(touch.clientX - dragStartX, 2) +
                  Math.pow(touch.clientY - dragStartY, 2)
                );

                // Only start dragging if finger moved more than 15px
                if (moveDistance < 15) return;

                setIsDraggingDates(true);

                // Find the button element under the touch point
                let element: HTMLElement | null = document.elementFromPoint(touch.clientX, touch.clientY) as HTMLElement;
                while (element && element.tagName !== 'BUTTON') {
                  element = element.parentElement;
                }

                const dateAttr = element?.getAttribute('data-date');

                if (dateAttr && dragStartDate) {
                  // Parse dates properly from YYYY-MM-DD format
                  const parseDate = (dateStr: string) => {
                    const [year, month, day] = dateStr.split('-').map(Number);
                    return new Date(year, month - 1, day);
                  };

                  const startDate = parseDate(dragStartDate);
                  const currentDate = parseDate(dateAttr);

                  const datesInRange = [];
                  const minDate = startDate <= currentDate ? startDate : currentDate;
                  const maxDate = startDate <= currentDate ? currentDate : startDate;

                  for (let d = new Date(minDate); d <= maxDate; d.setDate(d.getDate() + 1)) {
                    const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
                    datesInRange.push(dateStr);
                  }

                  setDraggedDates(datesInRange);
                }
              }}
              onTouchEnd={() => {
                if (isDraggingDates && draggedDates.length > 0) {
                  setSelectedDays(prev => {
                    const updated = new Set(prev);
                    draggedDates.forEach(date => {
                      if (updated.has(date)) {
                        updated.delete(date);
                      } else {
                        updated.add(date);
                      }
                    });
                    return Array.from(updated);
                  });
                }
                setIsDraggingDates(false);
                setDragStartDate(null);
                setDraggedDates([]);
              }}
            >
              {/* Day Headers */}
              <div className="grid grid-cols-7 gap-1 border-b border-border pb-3">
                {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day) => (
                  <div key={day} className="text-center text-xs font-semibold text-muted-foreground py-2">
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar Days */}
              <div className="grid grid-cols-7 gap-1">
                {(() => {
                  const year = currentCalendarMonth.getFullYear();
                  const month = currentCalendarMonth.getMonth();

                  // Get first day of month and number of days
                  const firstDay = new Date(year, month, 1).getDay();
                  const daysInMonth = new Date(year, month + 1, 0).getDate();
                  const daysInPrevMonth = new Date(year, month, 0).getDate();

                  const days = [];

                  // Previous month's days
                  for (let i = firstDay - 1; i >= 0; i--) {
                    days.push({
                      date: new Date(year, month - 1, daysInPrevMonth - i),
                      isCurrentMonth: false,
                      dateString: `${year}-${String(month).padStart(2, '0')}-${String(daysInPrevMonth - i).padStart(2, '0')}`
                    });
                  }

                  // Current month's days
                  for (let i = 1; i <= daysInMonth; i++) {
                    days.push({
                      date: new Date(year, month, i),
                      isCurrentMonth: true,
                      dateString: `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`
                    });
                  }

                  // Next month's days
                  const remainingDays = 42 - days.length; // 6 rows * 7 columns
                  for (let i = 1; i <= remainingDays; i++) {
                    days.push({
                      date: new Date(year, month + 1, i),
                      isCurrentMonth: false,
                      dateString: `${year}-${String(month + 2).padStart(2, '0')}-${String(i).padStart(2, '0')}`
                    });
                  }

                  const today = new Date();
                  const todayString = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

                  return days.map((day) => (
                    <button
                      key={`${month}-${day.dateString}`}
                      data-date={day.dateString}
                      onMouseDown={() => {
                        // Reset drag on mouse down
                        if (isDraggingDates) {
                          setIsDraggingDates(false);
                          setDragStartDate(null);
                          setDraggedDates([]);
                        }
                      }}
                      onClick={() => {
                        // Only allow clicks if we're not in a drag operation
                        if (!day.isCurrentMonth || isDraggingDates) return;
                        setSelectedDays(prev =>
                          prev.includes(day.dateString)
                            ? prev.filter(d => d !== day.dateString)
                            : [...prev, day.dateString]
                        );
                      }}
                      disabled={!day.isCurrentMonth}
                      className={`aspect-square p-1 rounded text-xs font-semibold transition-all flex items-center justify-center ${
                        !day.isCurrentMonth
                          ? 'text-muted-foreground/30 cursor-not-allowed'
                          : selectedDays.includes(day.dateString) || draggedDates.includes(day.dateString)
                          ? 'bg-primary text-primary-foreground font-bold shadow-sm'
                          : day.dateString === todayString
                          ? 'text-foreground border-2 border-primary ring-1 ring-primary/30 hover:bg-accent/50 cursor-pointer'
                          : 'text-foreground hover:bg-accent/50 border border-transparent hover:border-primary/30 cursor-pointer'
                      }`}
                    >
                      {day.date.getDate()}
                    </button>
                  ));
                })()}
              </div>
            </div>

            <div className="mt-4 text-center text-xs text-muted-foreground">
              {selectedDays.length > 0
                ? `Selected: ${selectedDays.join(', ')}`
                : 'Select days from the calendar.'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
