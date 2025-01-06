import { useMemeMelee } from "../hooks/useMemeMelee";
import { formatEther } from "viem";
import { useEffect, useState } from "react";

interface FormattedBet {
    user: string;
    memeHash: string;
    amount: string;
    timestamp: Date;
    memeName: string;
}

const RecentBets = () => {
    const { recentBets, getMemeDetails } = useMemeMelee();
    const [formattedBets, setFormattedBets] = useState<FormattedBet[]>([]);
    const [isLoading, setIsLoading] = useState(true);
console.log(recentBets);
    useEffect(() => {
        const fetchAndFormatBets = async () => {
            setIsLoading(true);
            try {
                
                if (!recentBets?.users?.length) {
                    setFormattedBets([]);
                    return;
                }

                const formatted = await Promise.all(
                    recentBets.users.map(async (user, index) => {
                        const memeDetails = await getMemeDetails(recentBets.betMemeHashes[index]);
                        return {
                            user: `${user.slice(0, 6)}...${user.slice(-4)}`,
                            memeHash: recentBets.betMemeHashes[index],
                            amount: formatEther(recentBets.amounts[index] || 0n),
                            timestamp: new Date(Number(recentBets.timestamps[index] || 0) * 1000),
                            memeName: memeDetails?.name || 'Unknown Meme'
                        };
                    })
                );

                setFormattedBets(formatted.reverse());
            } catch (error) {
                console.error('Error formatting bets:', error);
                setFormattedBets([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchAndFormatBets();
        
        // Set up polling interval
        const interval = setInterval(fetchAndFormatBets, 10000); // Poll every 10 seconds

        return () => clearInterval(interval);
    }, [recentBets, getMemeDetails]);

    if (isLoading) {
        return (
            <div className="text-gray-500 text-sm text-center py-4">
                Loading recent bets...
            </div>
        );
    }

    if (!formattedBets.length) {
        return (
            <div className="text-gray-500 text-sm text-center py-4">
                No bets placed yet
            </div>
        );
    }

    return (
        <div className="space-y-2 max-h-[200px] overflow-y-auto scrollbar-thin scrollbar-thumb-purple-200 scrollbar-track-transparent">
            {formattedBets.map((bet, index) => (
                <div
                    key={index}
                    className="flex items-center justify-between p-2 rounded-lg bg-purple-50 hover:bg-purple-100 transition-colors duration-200"
                >
                    <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                        <div>
                            <div className="text-sm font-medium text-gray-900">
                                {bet.memeName}
                            </div>
                            <div className="text-xs text-gray-500">
                                by {bet.user}
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center space-x-4">
                        <div className="text-sm font-medium text-gray-900">
                            {bet.amount} ETH
                        </div>
                        <div className="text-xs text-gray-500">
                            {bet.timestamp.toLocaleTimeString()}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default RecentBets;
