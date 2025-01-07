import { useWatchContractEvent } from 'wagmi';
import { useMemeMelee } from '../hooks/useMemeMelee';
import { Address } from 'viem';

function TransferEvents() {
  const { MEME_MELEE_ADDRESS, memeMeleeConfig } = useMemeMelee();

  useWatchContractEvent({
    address: MEME_MELEE_ADDRESS as Address,
    abi: memeMeleeConfig.abi,
    eventName: 'MemePicked',
    chainId: 37111,
    pollingInterval: 1000,
    batch: true,
    onLogs: (logs) => {
      console.log('MemePicked Event Logs:', logs);
      console.log('Event Details:', {
        address: MEME_MELEE_ADDRESS,
        chainId: 37111,
        eventName: 'MemePicked',
        timestamp: new Date().toISOString()
      });
    },
    onError: (error) => {
      console.error('Event watching error:', error);
    }
  });

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="bg-white rounded-lg shadow">
        <div className="flex space-x-4 p-4 border-b text-gray-600">
          <span className="font-medium">Recent Transactions</span>
        </div>
      </div>
    </div>
  );
}

export default TransferEvents;
