import React from 'react';
import { useWatchContractEvent } from 'wagmi';
import { formatEther } from 'viem';
import { formatDistanceToNow } from 'date-fns';
import { useMemeMelee } from '../hooks/useMemeMelee';

type TransferEventType = 'in' | 'out' | 'self' | 'transfer';

interface Transfer {
  hash: `0x${string}`;
  timestamp: number;
  from: `0x${string}`;
  to: `0x${string}`;
  value: bigint;
  type: TransferEventType;
}

function TransferEvents() {
  const [transfers, setTransfers] = React.useState<Transfer[]>([]);
  const { MEME_MELEE_ADDRESS, memeMeleeConfig } = useMemeMelee();

  const determineTransferType = (from: string, to: string): TransferEventType => {
    if (from.toLowerCase() === MEME_MELEE_ADDRESS.toLowerCase()) return 'out';
    if (to.toLowerCase() === MEME_MELEE_ADDRESS.toLowerCase()) return 'in';
    if (from.toLowerCase() === to.toLowerCase()) return 'self';
    return 'transfer';
  };

  useWatchContractEvent({
    ...memeMeleeConfig,
    eventName: 'MemePicked',
    onLogs: (logs) => {
      const newTransfers = logs.map(log => {
        if (!log.args?.user || !log.args?.memeHash || !log.args?.amount) {
          console.error('Missing required event arguments', log);
          return null;
        }

        return {
          hash: log.transactionHash,
          timestamp: new Date().getTime(),
          from: log.args.user,
          to: MEME_MELEE_ADDRESS,
          value: log.args.amount,
          type: 'in' as TransferEventType
        };
      }).filter((transfer): transfer is Transfer => transfer !== null);

      setTransfers(prev => [...newTransfers, ...prev]);
    }
  });

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="bg-white rounded-lg shadow">
        <div className="flex space-x-4 p-4 border-b text-gray-600">
          <span className="font-medium">Recent Transactions</span>
        </div>
        <div className="divide-y">
          {transfers.map((transfer, index) => (
            <div key={`${transfer.hash}-${index}`} className="p-4 hover:bg-gray-50">
              <div className="grid grid-cols-[2fr,1fr] gap-4">
                <div>
                  <div className="text-blue-600 font-mono text-sm mb-2">
                    {formatAddress(transfer.hash)}
                  </div>
                  <div className="text-gray-500 text-sm">
                    {formatDistanceToNow(transfer.timestamp)} ago
                  </div>
                  <div className="text-gray-600 mt-2">
                    <div>From: {formatAddress(transfer.from)}</div>
                    <div>To: Contract</div>
                  </div>
                </div>
                <div className="text-right">
                  <span className="inline-block px-2 py-1 rounded text-sm bg-green-100 text-green-800">
                    Bet Placed
                  </span>
                  <div className="mt-2 font-medium">
                    {formatEther(transfer.value)} ETH
                  </div>
                </div>
              </div>
            </div>
          ))}
          {transfers.length === 0 && (
            <div className="p-4 text-center text-gray-500">
              No transactions yet
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default TransferEvents;
