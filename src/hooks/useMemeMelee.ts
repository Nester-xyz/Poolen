import { useReadContract, useWriteContract, useWaitForTransactionReceipt, useAccount } from 'wagmi';
import MemeMeleeABI from '../../server/deployments-zk/lensTestnet/contracts/MemeMelee.sol/MemeMelee.json';

const MEME_MELEE_ADDRESS = '0x351C82EDf8636bbd29680D00D4cBDFbF3f10763E';
const memeMeleeConfig = {
	address: MEME_MELEE_ADDRESS,
	abi: MemeMeleeABI.abi,
} as const;



interface MemeDetails {
	name: string;
	totalWagered: bigint;
	pickCount: number;
	openPrice: bigint;
	closePrice: bigint;
	exists: boolean;
}

export const useMemeMelee = () => {
	const { address } = useAccount();

	// Read Functions
	const { data: owner } = useReadContract({
		...memeMeleeConfig,
		functionName: 'owner',
	});

	const { data: grassToken } = useReadContract({
		...memeMeleeConfig,
		functionName: 'grassToken',
	});

	const { data: currentRound } = useReadContract({
		...memeMeleeConfig,
		functionName: 'currentRound',
	});

	const { data: roundActive } = useReadContract({
		...memeMeleeConfig,
		functionName: 'roundActive',
	});

	// Modified to be a proper hook usage

	const useMemeDetails = (memeHash: string) => {
		const { data, isError, isPending } = useReadContract({
			...memeMeleeConfig,
			functionName: 'getMemeDetails',
			args: [memeHash],
		}) as { data: [string, bigint, number, bigint, bigint, boolean], isError: boolean, isPending: boolean };

		const memeDetails: MemeDetails | null = data ? {
			name: data[0],
			totalWagered: data[1],
			pickCount: data[2],
			openPrice: data[3],
			closePrice: data[4],
			exists: data[5]
		} : null;

		return { memeDetails, isError, isPending };
	};

	const { data: userRewards, refetch: refetchUserRewards } = useReadContract({
		...memeMeleeConfig,
		functionName: 'userRewards',
		args: [/* user address will be needed */],
	});

	// Write Functions
	const { data: addMemeHash, isPending: isAddMemePending, writeContract: writeAddMeme } = useWriteContract();
	const { data: pickMemeHash, isPending: isPickMemePending, writeContract: writePickMeme } = useWriteContract();
	const { data: endRoundHash, isPending: isEndRoundPending, writeContract: writeEndRound } = useWriteContract();
	const { data: claimRewardHash, isPending: isClaimRewardPending, writeContract: writeClaimReward } = useWriteContract();

	// Transaction Receipts
	const { isLoading: isAddMemeConfirming, isSuccess: isAddMemeConfirmed } = useWaitForTransactionReceipt({
		hash: addMemeHash,
	});

	const { isLoading: isPickMemeConfirming, isSuccess: isPickMemeConfirmed } = useWaitForTransactionReceipt({
		hash: pickMemeHash,
	});

	const { isLoading: isEndRoundConfirming, isSuccess: isEndRoundConfirmed } = useWaitForTransactionReceipt({
		hash: endRoundHash,
	});

	const { isLoading: isClaimRewardConfirming, isSuccess: isClaimRewardConfirmed } = useWaitForTransactionReceipt({
		hash: claimRewardHash,
	});

	// Contract Functions
	const addMeme = async (memeName: string, openPrice: bigint) => {
		writeAddMeme({
			...memeMeleeConfig,
			functionName: 'addMeme',
			args: [memeName, openPrice],
			gas: 300000n,
		});
	};

	const pickMeme = async (memeHash: string, wagerAmount: bigint) => {
		if (!address) throw new Error('Wallet not connected');

		try {

			const result = writePickMeme({
				address: MEME_MELEE_ADDRESS,
				abi: MemeMeleeABI.abi,
				functionName: 'pickMeme',
				args: [memeHash],
				value: wagerAmount,
				chainId: 37111,
				gas: 300000n,
				account: address
			});

			return result;
		} catch (error: any) {
			if (error?.code === 4001) {
				throw new Error('Transaction rejected by user');
			}
			console.error('PickMeme failed:', error);
			throw error;
		}
	};


	const endRound = async (memeHash: string, closePrice: bigint) => {
		writeEndRound({
			...memeMeleeConfig,
			functionName: 'endRound',
			args: [memeHash, closePrice],
			gas: 300000n,
		});
	};

	const claimReward = async (config?: { gas?: bigint }) => {
		writeClaimReward({
			...memeMeleeConfig,
			functionName: 'claimReward',
			...config
		});
	};

	const isLoading =
		isAddMemePending ||
		isPickMemePending ||
		isEndRoundPending ||
		isClaimRewardPending ||
		isAddMemeConfirming ||
		isPickMemeConfirming ||
		isEndRoundConfirming ||
		isClaimRewardConfirming;

	const isSuccess =
		isAddMemeConfirmed ||
		isPickMemeConfirmed ||
		isEndRoundConfirmed ||
		isClaimRewardConfirmed;

	return {
		// Read Functions
		owner,
		grassToken,
		currentRound,
		roundActive,
		useMemeDetails,
		userRewards,
		refetchUserRewards,

		// Write Functions
		addMeme,
		pickMeme,
		endRound,
		claimReward,

		// Loading States
		isLoading,
		isSuccess,
		isAddMemePending,
		isPickMemePending,
		isEndRoundPending,
		isClaimRewardPending,

		// Confirmation States
		isAddMemeConfirming,
		isPickMemeConfirming,
		isEndRoundConfirming,
		isClaimRewardConfirming,

		// Success States
		isAddMemeConfirmed,
		isPickMemeConfirmed,
		isEndRoundConfirmed,
		isClaimRewardConfirmed,
	};
};
