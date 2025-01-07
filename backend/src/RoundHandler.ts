import Moralis from 'moralis';
import { BigNumberish, ethers } from 'ethers';
import dotenv from 'dotenv';
dotenv.config();

// Minimal ABI
const minimumABI = [
	{
		"inputs": [],
		"name": "getRoundEndTime",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "winningMeme",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "closePrice",
				"type": "uint256"
			}
		],
		"name": "endRound",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	}
];

interface PriceData {
	priceChange: number;
	currentPrice: string;
}

export interface RoundCheckResult {
	isEnded: boolean;
	priceData?: PriceData;
	roundEndTime: number;
}

export class RoundHandler {
	private provider: ethers.JsonRpcProvider;
	private contractAddress: string;
	private readonly rpcUrl: string;
	private readonly chainId: number;

	constructor(contractAddress: string) {
		this.rpcUrl = "https://lens-sepolia.g.alchemy.com/v2/uQOK8iwpuKdoOVqSXL6htllJT1g64EOQ";
		this.chainId = Number(process.env.CHAIN_ID) || 37111;
		this.provider = new ethers.JsonRpcProvider(this.rpcUrl);
		this.contractAddress = contractAddress;
	}

	async checkRoundStatus(): Promise<RoundCheckResult> {
		try {
			const contract = new ethers.Contract(
				this.contractAddress,
				minimumABI,
				this.provider
			);

			const roundEndTime = await contract.getRoundEndTime();
			const currentTime = Math.floor(Date.now() / 1000);

			if (currentTime < roundEndTime.toNumber()) {
				return {
					isEnded: false,
					roundEndTime: roundEndTime.toNumber()
				};
			}

			const priceData = await this.fetchTokenPriceData();
			return {
				isEnded: true,
				roundEndTime: roundEndTime.toNumber(),
				priceData
			};
		} catch (error) {
			console.error('Error checking round status:', error);
			throw error;
		}
	}

	private async fetchTokenPriceData(): Promise<PriceData> {
		try {
			await Moralis.start({
				apiKey: process.env.MORALIS_API_KEY
			});

			const response = await Moralis.EvmApi.token.getTokenPrice({
				address: this.contractAddress,
				chain: this.chainId.toString(),
				include: "percent_change"
			});

			return {
				priceChange: Number(response.raw["24hrPercentChange"]) || 0,
				currentPrice: ethers.parseEther(
					response.raw.usdPrice.toString()
				).toString()
			};
		} catch (error) {
			console.error('Error fetching price data from Moralis:', error);
			throw error;
		}
	}
}

export async function initializeRoundHandler(): Promise<RoundHandler> {
	if (!process.env.CONTRACT_ADDRESS) {
		throw new Error('CONTRACT_ADDRESS environment variable is not set');
	}
	return new RoundHandler(process.env.CONTRACT_ADDRESS);
}
