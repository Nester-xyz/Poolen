import { useMemeMelee } from "../hooks/useMemeMelee";
import { formatEther } from "viem";
import { useEffect, useState } from "react";
import { fetchAccount } from "@lens-protocol/client/actions";
import { useSessionClient } from "../context/sessionContext";

interface FormattedBet {
    user: string;
    memeHash: string;
    amount: string;
    timestamp: Date;
    memeName: string;
}

const formatUsername = (username: string) => {
    const cleanUsername = username.replace(/^lens\//, '');
    return cleanUsername.length > 15
        ? `${cleanUsername.slice(0, 15)}...`
        : cleanUsername;
};

const getRelativeTime = (timestamp: Date) => {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - timestamp.getTime()) / 1000);

    // Less than a minute
    if (diffInSeconds < 60) {
        return 'just now';
    }

    // Less than an hour
    if (diffInSeconds < 3600) {
        const minutes = Math.floor(diffInSeconds / 60);
        return `${minutes}m ago`;
    }

    // Less than a day
    if (diffInSeconds < 86400) {
        const hours = Math.floor(diffInSeconds / 3600);
        return `${hours}h ago`;
    }

    // Less than a month
    const days = Math.floor(diffInSeconds / 86400);
    return `${days}d ago`;
};

const RecentBets = () => {
    const { recentBets, getMemeDetails } = useMemeMelee();
    const [formattedBets, setFormattedBets] = useState<FormattedBet[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { sessionClient } = useSessionClient();

    useEffect(() => {
        const formatBets = async () => {
            if (!recentBets?.[0]?.length) {
                setFormattedBets([]);
                setIsLoading(false);
                return;
            }

            try {
                const [users, memeHashes, amounts, timestamps] = recentBets;
                const formatted = await Promise.all(
                    users.map(async (user, index) => {
                        const memeDetails = await getMemeDetails(memeHashes[index]);

                        const account = await fetchAccount(sessionClient, { address: user });
                        const username = account.match(
                            (result) => {
                                const rawUsername = result?.username?.value || `${user.slice(0, 16)}...`;
                                return formatUsername(rawUsername);
                            },
                            () => `${user.slice(0, 12)}...${user.slice(-4)}`
                        );

                        return {
                            user: username,
                            memeHash: memeHashes[index],
                            amount: formatEther(amounts[index]),
                            timestamp: new Date(Number(timestamps[index]) * 1000),
                            memeName: memeDetails?.name || 'Unknown Meme'
                        };
                    })
                );
                setFormattedBets(formatted.reverse());
            } catch (error) {
                console.error('Error formatting bets:', error);
            } finally {
                setIsLoading(false);
            }
        };

        formatBets();
    }, [recentBets, sessionClient,]);

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
                            {bet.amount} GRASS
                        </div>
                        <div className="text-xs text-gray-500">
                            {getRelativeTime(bet.timestamp)}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default RecentBets;
