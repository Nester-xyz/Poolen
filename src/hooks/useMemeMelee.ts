import { useReadContract, useWriteContract, useWaitForTransactionReceipt, useAccount, usePublicClient, useBalance} from 'wagmi';
import { encodeFunctionData } from 'viem';
import MemeMeleeABI from '../../server/deployments-zk/lensTestnet/contracts/MemeMelee.sol/MemeMelee.json';
import { useSessionClient } from '../context/sessionContext';
import { Address } from 'viem';
const MEME_MELEE_ADDRESS = '0xf91c4801a94D9cc28A974EE53CaBf8fBE5915b57';

// Add Lens Account ABI
const accountABI = [
	{
		name: "executeTransaction",
		type: "function",
		inputs: [
			{ name: "to", type: "address" },
			{ name: "value", type: "uint256" },
			{ name: "data", type: "bytes" }
		],
		outputs: [],
		stateMutability: "nonpayable"
	}
] as const;

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
	const { activeLensAddress } = useSessionClient()
	const { data: balance } = useBalance({
		address: activeLensAddress, // Address of the smart contract
	}); 
	const publicClient = usePublicClient();

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

	const { data: roundEndTime } = useReadContract({
		...memeMeleeConfig,
		functionName: 'getRoundEndTime',
	});

	const { data: memeHashes } = useReadContract({
		...memeMeleeConfig,
		functionName: 'getMemeHashes',
	}) as { data: `0x${string}`[] | undefined };

	const { data: recentBets } = useReadContract({
		...memeMeleeConfig,
		functionName: 'getRecentBets'
	}) as {
		data: [
			Address[], // users array
			`0x${string}`[], // betMemeHashes array
			bigint[], // amounts array
			bigint[] // timestamps array
		] | undefined
	};

	// Get meme details directly using the public client
	const getMemeDetails = async (memeHash: string): Promise<MemeDetails | null> => {
		try {
			const data = await publicClient!.readContract({
				...memeMeleeConfig,
				functionName: 'getMemeDetails',
				args: [memeHash],
			});

			if (!data) return null;

			const [name, totalWagered, pickCount, openPrice, closePrice, exists] = data as [string, bigint, number, bigint, bigint, boolean];

			return {
				name,
				totalWagered,
				pickCount,
				openPrice,
				closePrice,
				exists
			};
		} catch (error) {
			console.error('Error reading meme details:', error);
			return null;
		}
	};

	const { data: userRewards, refetch: refetchUserRewards } = useReadContract({
		...memeMeleeConfig,
		functionName: 'userRewards',
		args: [address],
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

	// Add new Lens Account transaction functionality
	const { data: lensTransactionHash, isPending: isLensTransactionPending, writeContract: writeLensTransaction } = useWriteContract();

	const executeLensTransaction = async ({
		targetFunction,
		args,
		value = 0n
	}: {
		targetFunction: string;
		args: any[];
		value?: bigint;
	}) => {
		try {
			console.log('Starting Lens transaction...', {
				targetFunction,
				args,
				value,
				lensAccount: activeLensAddress,
				targetContract: MEME_MELEE_ADDRESS
			});

			const encodedData = encodeFunctionData({
				abi: MemeMeleeABI.abi,
				functionName: targetFunction,
				args: args
			});

			console.log('Encoded function data:', encodedData);

			const txResponse = writeLensTransaction({
				address: activeLensAddress!,
				abi: accountABI,
				functionName: 'executeTransaction',
				args: [
					MEME_MELEE_ADDRESS,
					value,
					encodedData
				],
			});

			console.log('Transaction response:', txResponse);
			return txResponse;
		} catch (error: any) {
			console.error('Detailed error executing Lens transaction:', {
				error,
				errorMessage: error.message,
				errorCode: error.code,
				errorData: error.data
			});
			throw error;
		}
	};

	// Modify existing contract functions to support Lens Account transactions
	const addMeme = async (memeName: string, openPrice: bigint, useLensAccount = false) => {
		console.log('AddMeme called with:', { memeName, openPrice, useLensAccount });

		if (useLensAccount) {
			console.log('Using Lens Account for addMeme');
			return executeLensTransaction({
				targetFunction: 'addMeme',
				args: [memeName, openPrice],
			});
		}

		console.log('Using direct contract call for addMeme');
		return writeAddMeme({
			...memeMeleeConfig,
			functionName: 'addMeme',
			args: [memeName, openPrice],
			gas: 300000n,
		});
	};

	const pickMeme = async (memeHash: string, wagerAmount: bigint, useLensAccount = false) => {
		if (!address) throw new Error('Wallet not connected');

		console.log('PickMeme called with:', { memeHash, wagerAmount, useLensAccount });

		try {
			if (useLensAccount) {
				console.log('Using Lens Account for pickMeme');
				return executeLensTransaction({
					targetFunction: 'pickMeme',
					args: [memeHash],
					value: wagerAmount,
				});
			}

			console.log('Using direct contract call for pickMeme');
			return writePickMeme({
				address: MEME_MELEE_ADDRESS,
				abi: MemeMeleeABI.abi,
				functionName: 'pickMeme',
				args: [memeHash],
				value: wagerAmount,
				chainId: 37111,
				gas: 300000n,
				account: address
			});
		} catch (error: any) {
			console.error('Detailed pickMeme error:', {
				error,
				errorMessage: error.message,
				errorCode: error.code,
				errorData: error.data
			});
			if (error?.code === 4001) {
				throw new Error('Transaction rejected by user');
			}
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

	// Add new write contract hook for Lens claim
	const { writeContract: writeLensClaim } = useWriteContract();

	// Add new function for claiming through Lens
	const claimBalanceLens = async () => {
		if (!activeLensAddress) throw new Error('No Lens address');
		if (!address) throw new Error('No wallet address');
		
		return writeLensClaim({
			address: activeLensAddress,
			abi: accountABI,
			functionName: 'executeTransaction',
			args: [
				address as `0x${string}`,
				balance?.value as bigint,
				'0x'
			],
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
		isClaimRewardConfirming ||
		isLensTransactionPending;

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
		roundEndTime,
		memeHashes,
		getMemeDetails,
		userRewards,
		refetchUserRewards,
		recentBets,
		MEME_MELEE_ADDRESS,

		// Write Functions
		addMeme,
		pickMeme,
		endRound,
		claimReward,
		claimBalanceLens,

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

		// Add Lens Account functionality
		executeLensTransaction,
		isLensTransactionPending,
		lensTransactionHash,
		memeMeleeConfig,
	};
};
