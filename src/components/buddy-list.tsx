import React from 'react';
import { useOfficeBuddies } from '../app/office-buddies-context';

const BuddyList = () => {
  const { buddies } = useOfficeBuddies();

  return (
    <div className="p-4 bg-white rounded shadow w-80">
      <h2 className="text-lg font-bold mb-2">Your Office Buddies</h2>
      {buddies.length === 0 ? (
        <div className="text-gray-500">No buddies yet</div>
      ) : (
        <ul>
          {buddies.map((b) => (
            <li key={b.id} className="p-2 border-b last:border-b-0">
              {b.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default BuddyList;
