// ...existing code...
import { useOfficeBuddies } from '../app/office-buddies-context';

const BuddyInvitesList = () => {
  const { invites, coworkers, acceptInvite, declineInvite } = useOfficeBuddies();

  const received = invites.filter((inv) => inv.to === 'me');
  const sent = invites.filter((inv) => inv.from === 'me');

  const getName = (id: string) => {
// ...existing code...
    const c = coworkers.find((c) => c.id === id);
    return c ? c.name : id;
  };

  return (
    <div className="p-4 bg-white rounded shadow w-96">
      <h2 className="text-lg font-bold mb-2">Buddy Invites</h2>
      <div className="mb-4">
        <h3 className="font-semibold mb-1">Received</h3>
        {received.length === 0 && <div className="text-gray-500">No invites</div>}
        <ul>
          {received.map((inv) => (
            <li key={inv.id} className="flex items-center justify-between mb-2">
              <span>{getName(inv.from)}</span>
              <span>
                {inv.status === 'pending' ? (
                  <>
                    <button
                      className="bg-green-500 text-white px-2 py-1 rounded mr-2"
                      onClick={() => acceptInvite(inv.id)}
                    >
                      Accept
                    </button>
                    <button
                      className="bg-red-500 text-white px-2 py-1 rounded"
                      onClick={() => declineInvite(inv.id)}
                    >
                      Decline
                    </button>
                  </>
                ) : (
                  <span className="text-gray-400">{inv.status}</span>
                )}
              </span>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h3 className="font-semibold mb-1">Sent</h3>
        {sent.length === 0 && <div className="text-gray-500">No invites</div>}
        <ul>
          {sent.map((inv) => (
            <li key={inv.id} className="flex items-center justify-between mb-2">
              <span>{getName(inv.to)}</span>
              <span className="text-gray-400">{inv.status}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default BuddyInvitesList;
