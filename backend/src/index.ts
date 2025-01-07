import { RoundHandler } from './RoundHandler';
import { ethers } from 'ethers';
import dotenv from 'dotenv';
dotenv.config();

class RoundMonitor {
	private roundHandler: RoundHandler;
	private provider: ethers.JsonRpcProvider;
	private isRunning: boolean = false;

	constructor(roundHandler: RoundHandler) {
		this.roundHandler = roundHandler;
		this.provider = new ethers.JsonRpcProvider("https://lens-sepolia.g.alchemy.com/v2/uQOK8iwpuKdoOVqSXL6htllJT1g64EOQ");
	}

	async start() {
		this.isRunning = true;
		console.log('Starting round monitoring...');

		while (this.isRunning) {
			try {
				// Check round status
				const status = await this.roundHandler.checkRoundStatus();
				const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds

				if (status.isEnded) {
					console.log('Round has ended!');
					console.log('Price data:', status.priceData);
					// Add your round end handling logic here
					break;
				}

				// Calculate wait time based on difference between roundEndTime and current time
				const timeUntilEnd = (status.roundEndTime - currentTime);

				// Apply 0.8 factor and convert to milliseconds
				const waitTime = Math.floor(timeUntilEnd * 0.9) * 1000;

				console.log(`Round still active. Time until end: ${timeUntilEnd} seconds`);
				console.log(`Waiting for adjusted time: ${waitTime / 1000} seconds...`);

				await new Promise(resolve => setTimeout(resolve, waitTime));

			} catch (error) {
				console.error('Error in monitoring loop:', error);
				// Wait 30 seconds before retrying on error
				await new Promise(resolve => setTimeout(resolve, 30000));
			}
		}
	}

	stop() {
		this.isRunning = false;
		console.log('Stopping round monitoring...');
	}
}

// Script execution
async function main() {
	try {
		if (!process.env.CONTRACT_ADDRESS) {
			throw new Error('CONTRACT_ADDRESS environment variable is not set');
		}

		const roundHandler = new RoundHandler(process.env.CONTRACT_ADDRESS);
		const monitor = new RoundMonitor(roundHandler);

		// Handle graceful shutdown
		process.on('SIGINT', () => {
			console.log('Received SIGINT. Gracefully shutting down...');
			monitor.stop();
		});

		process.on('SIGTERM', () => {
			console.log('Received SIGTERM. Gracefully shutting down...');
			monitor.stop();
		});

		// Start monitoring
		await monitor.start();

	} catch (error) {
		console.error('Fatal error:', error);
		process.exit(1);
	}
}

// Run the script
main().catch(console.error);
