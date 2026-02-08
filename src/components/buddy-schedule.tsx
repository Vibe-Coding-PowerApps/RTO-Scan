import React, { useState } from 'react';
import { useOfficeBuddies } from '../app/office-buddies-context';

const BuddySchedule = () => {
  const { buddies, schedules } = useOfficeBuddies();
  const [date, setDate] = useState('2026-02-10');

  return (
    <div className="p-4 bg-white rounded shadow w-96">
      <h2 className="text-lg font-bold mb-2">Buddies' Schedules</h2>
      <input
        type="date"
        className="border p-2 mb-4 w-full"
        value={date}
        onChange={(e) => setDate(e.target.value)}
      />
      {buddies.length === 0 ? (
        <div className="text-gray-500">No buddies to show</div>
      ) : (
        <ul>
          {buddies.map((b) => {
            const sched = (schedules[b.id] || []).find((s) => s.date === date);
            return (
              <li key={b.id} className="mb-2 p-2 border rounded">
                <div className="font-semibold">{b.name}</div>
                {sched ? (
                  <div>
                    <span className="text-sm">Floor: {sched.floor}, Desk: {sched.desk}</span>
                  </div>
                ) : (
                  <span className="text-gray-400 text-sm">Not in office</span>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default BuddySchedule;
