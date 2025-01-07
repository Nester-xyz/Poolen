import React from 'react';
import { useWatchContractEvent } from 'wagmi';
import { formatEther } from 'viem';
import { formatDistanceToNow } from 'date-fns';
import { useMemeMelee } from '../hooks/useMemeMelee';

type TransferEventType = 'in' | 'out';

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

  // Log the contract configuration for debugging
  React.useEffect(() => {
    console.log('Contract Config:', memeMeleeConfig);
    console.log('Contract Address:', MEME_MELEE_ADDRESS);
  }, [memeMeleeConfig, MEME_MELEE_ADDRESS]);

  useWatchContractEvent({
    ...memeMeleeConfig,
    eventName: 'Transfer',
    onLogs: (logs) => {
      console.log('Raw Event Logs:', logs); // Debug log for raw events

      const newTransfers = logs.map(log => {
        // Debug log for individual event data
        console.log('Processing log:', {
          transactionHash: log.transactionHash,
          args: log.args,
          blockNumber: log.blockNumber,
          address: log.address
        });

        // Validate required fields
        if (!log.args?.from || !log.args?.to || !log.args?.value) {
          console.error('Missing required event arguments', {
            from: log.args?.from,
            to: log.args?.to,
            value: log.args?.value
          });
          return null;
        }

        const type: TransferEventType = 
          log.args.to === MEME_MELEE_ADDRESS ? 'in' : 'out';

        // Log the processed transfer
        const transfer = {
          hash: log.transactionHash,
          timestamp: new Date().getTime(),
          from: log.args.from,
          to: log.args.to,
          value: log.args.value,
          type
        };
        console.log('Processed Transfer:', transfer);
        return transfer;
      }).filter((transfer): transfer is Transfer => transfer !== null);

      console.log('New Transfers to add:', newTransfers);

      setTransfers(prev => {
        const updated = [...newTransfers, ...prev];
        console.log('Updated transfers state:', updated);
        return updated;
      });
    },
    onError: (error) => {
      console.error('Contract event error:', error);
    }
  });

  // Log whenever transfers state changes
  React.useEffect(() => {
    console.log('Current transfers state:', transfers);
  }, [transfers]);

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const getTransactionLabel = (type: TransferEventType) => {
    return type === 'in' ? 'Received' : 'Sent';
  };

  const getTransactionColor = (type: TransferEventType) => {
    return type === 'in' 
      ? 'bg-green-100 text-green-800'
      : 'bg-red-100 text-red-800';
  };

  if (!memeMeleeConfig || !MEME_MELEE_ADDRESS) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-center text-gray-500">
            Loading contract configuration...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="bg-white rounded-lg shadow">
        <div className="flex justify-between items-center p-4 border-b text-gray-600">
          <span className="font-medium">Recent Transfers</span>
          <span className="text-sm">Contract: {formatAddress(MEME_MELEE_ADDRESS)}</span>
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
                    <div>To: {formatAddress(transfer.to)}</div>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`inline-block px-2 py-1 rounded text-sm ${getTransactionColor(transfer.type)}`}>
                    {getTransactionLabel(transfer.type)}
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
              No transfers yet
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default TransferEvents;