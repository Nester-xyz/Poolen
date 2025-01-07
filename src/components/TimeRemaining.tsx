import { useEffect, useState } from 'react';
import { usePublicClient } from 'wagmi';

const TimeRemaining = ({ endTime }:{endTime:string}) => {
  const [timeLeft, setTimeLeft] = useState('');
  const [initialDiff, setInitialDiff] = useState<number | null>(null);
  const publicClient = usePublicClient();

  const formatTime = (timeInSeconds: any) => {
    if (timeInSeconds <= 0) return 'Ended';

    const hours = Math.floor(timeInSeconds / 3600);
    const minutes = Math.floor((timeInSeconds % 3600) / 60);
    const seconds = timeInSeconds % 60;

    const parts = [];
    if (hours > 0) parts.push(`${hours}h`);
    if (minutes > 0 || hours > 0) parts.push(`${minutes}m`);
    parts.push(`${seconds}s`);

    return parts.join(' ');
  };

  // Initial setup to get the blockchain time once
  useEffect(() => {
    const initializeTimer = async () => {
      try {
        if (!endTime) {
          setTimeLeft('24h');
          return;
        }

        const block = await publicClient!.getBlock();
        const currentTimestamp = Number(block.timestamp);
        const endTimestamp = Number(endTime);
        const diff = endTimestamp - currentTimestamp;

        setInitialDiff(diff!);
      } catch (error) {
        console.error('Error initializing timer:', error);
        setTimeLeft('24h');
      }
    };

    initializeTimer();
  }, [endTime, publicClient]);

  // Local countdown
  useEffect(() => {
    if (initialDiff === null) return;

    let secondsLeft = initialDiff;
    const updateTimer = () => {
      if (secondsLeft <= 0) {
        setTimeLeft('Ended');
        return;
      }
      setTimeLeft(formatTime(secondsLeft));
      secondsLeft -= 1;
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [initialDiff]);

  return (
    <div className="text-sm font-medium">
      Time Left: {timeLeft || "24h"}
    </div>
  );
};

export default TimeRemaining;
