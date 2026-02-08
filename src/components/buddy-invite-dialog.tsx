
import { useState } from 'react';
import { useOfficeBuddies } from '../app/office-buddies-context';

type Coworker = { id: string; name: string };

const BuddyInviteDialog = () => {
  const { coworkers, sendInvite } = useOfficeBuddies();
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<Coworker | null>(null);
  const [sent, setSent] = useState(false);

  const filtered = coworkers.filter(
    (c) => c.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleSend = () => {
    if (selected) {
      sendInvite(selected.id);
      setSent(true);
    }
  };

  return (
    <div className="p-4 bg-white rounded shadow w-80">
      <h2 className="text-lg font-bold mb-2">Invite a Buddy</h2>
      <input
        className="border p-2 w-full mb-2"
        placeholder="Search coworkers..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <ul className="mb-2 max-h-32 overflow-y-auto">
        {filtered.map((c) => (
          <li
            key={c.id}
            className={`p-2 cursor-pointer rounded ${selected?.id === c.id ? 'bg-blue-100' : ''}`}
            onClick={() => setSelected(c)}
          >
            {c.name}
          </li>
        ))}
      </ul>
      <button
        className="bg-blue-600 text-white px-4 py-2 rounded w-full disabled:opacity-50"
        onClick={handleSend}
        disabled={!selected || sent}
      >
        {sent ? 'Invite Sent!' : 'Send Invite'}
      </button>
    </div>
  );
};

export default BuddyInviteDialog;
