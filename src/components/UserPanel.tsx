import React, { useState, useEffect } from 'react';
import { useMemeMelee } from '../hooks/useMemeMelee';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Alert, AlertDescription } from './ui/alert';
import { Loader2 } from 'lucide-react';
import { ethers } from 'ethers';
import { useWaitForTransactionReceipt } from 'wagmi';

// Define interfaces for type safety
export interface MemeDetails {
  name: string;
  totalWagered: bigint;
  pickCount: number;
  openPrice: bigint;
  closePrice: bigint;
}

const UserPanel: React.FC = () => {
  const {
    currentRound,
    roundActive,
    userRewards,
    pickMeme,
    claimReward,
    useMemeDetails,
    isPickMemePending,
    isClaimRewardPending,
    isPickMemeConfirming,
    isClaimRewardConfirming,
    isPickMemeConfirmed,
    isClaimRewardConfirmed
  } = useMemeMelee();

  const [memeHash, setMemeHash] = useState<string>('');
  const [wagerAmount, setWagerAmount] = useState<string>('');
  const { memeDetails } = useMemeDetails(memeHash);

  const [approvalTx, setApprovalTx] = useState<`0x${string}` | undefined>();

  const { isSuccess: isApprovalConfirmed } = useWaitForTransactionReceipt({
    hash: approvalTx,
  });

  useEffect(() => {
    const executePick = async () => {
      if (isApprovalConfirmed && memeHash && wagerAmount) {
        try {
          const wagerInWei = ethers.parseEther(wagerAmount);
          await pickMeme(memeHash, wagerInWei);
          setMemeHash('');
          setWagerAmount('');
          setApprovalTx(undefined);
        } catch (error) {
          console.error('Error in pickMeme:', error);
          alert('Failed to pick meme after approval');
        }
      }
    };

    executePick();
  }, [isApprovalConfirmed, memeHash, wagerAmount]);

  const isLoading = isPickMemePending || isClaimRewardPending || isPickMemeConfirming || isClaimRewardConfirming;

  // Format BigInt to readable string with proper error handling
  const formatBigInt = (value: bigint | undefined | null): string => {
    try {
      if (!value) return '0.0';
      return ethers.formatEther(value);
    } catch (error) {
      console.error('Error formatting BigInt:', error);
      return '0.0';
    }
  };

  // Validate wager amount input
  const isValidWagerAmount = (amount: string): boolean => {
    try {
      if (!amount) return false;
      const parsed = ethers.parseEther(amount);
      console.log(parsed);
      return parsed > ethers.parseEther('0');
    } catch {
      return false;
    }
  };

  // Handle Pick Meme with error handling and input validation
  const handlePickMeme = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    if (!memeHash || !isValidWagerAmount(wagerAmount)) {
      alert('Please enter a valid meme hash and wager amount');
      return;
    }

    try {
      const wagerInWei = ethers.parseEther(wagerAmount);
      await pickMeme(memeHash, wagerInWei);
      setMemeHash('');
      setWagerAmount('');
    } catch (error) {
      console.error('PickMeme transaction failed:', error);
      alert(error instanceof Error ? error.message : 'Transaction failed');
    }
  };

  // Handle Claim Reward with proper error handling
  const handleClaimReward = async (): Promise<void> => {
    try {
      await claimReward({ gas: 300000n });
    } catch (error) {
      console.error('Error claiming reward:', error);
      alert(error instanceof Error ? error.message : 'Failed to claim rewards');
    }
  };

  // Format prices for display
  const formatPrice = (price: bigint): string => {
    try {
      return ethers.formatEther(price);
    } catch (error) {
      console.error('Error formatting price:', error);
      return '0.0';
    }
  };

  return (
    <div className="space-y-6 p-6">
      <Card>
        <CardHeader>
          <CardTitle>User Panel</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Feedback Alerts */}
          {isPickMemeConfirmed && (
            <Alert className="mb-4">
              <AlertDescription>Meme picked successfully!</AlertDescription>
            </Alert>
          )}
          {isClaimRewardConfirmed && (
            <Alert className="mb-4">
              <AlertDescription>Rewards claimed successfully!</AlertDescription>
            </Alert>
          )}

          {/* Round Information */}
          <div className="space-y-2">
            <h3 className="text-lg font-medium">
              Current Round: {currentRound?.toString() || 'N/A'}
            </h3>
            <p className="text-sm text-gray-500">
              Round Status: {roundActive ? 'Active' : 'Ended'}
            </p>
          </div>

          {memeDetails && (
            <div className="space-y-2 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium">Meme Details</h4>
              <p>Name: {memeDetails.name}</p>
              <p>Total Wagered: {formatBigInt(memeDetails.totalWagered)} GRASS</p>
              <p>Pick Count: {memeDetails.pickCount}</p>
              <p>Open Price: {formatPrice(memeDetails.openPrice)} GRASS</p>
              {memeDetails.closePrice > 0n && (
                <p>Close Price: {formatPrice(memeDetails.closePrice)} GRASS</p>
              )}
            </div>
          )}

          {/* Meme Picking Form */}
          <form onSubmit={handlePickMeme} className="space-y-4">
            <div className="space-y-2">
              <h3 className="text-lg font-medium">Pick a Meme</h3>
              <Input
                type="text"
                placeholder="Meme Hash"
                value={memeHash}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setMemeHash(e.target.value)}
                disabled={isLoading}
              />
              <Input
                type="text"
                placeholder="Wager Amount (GRASS)"
                value={wagerAmount}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setWagerAmount(e.target.value)}
                disabled={isLoading}
                pattern="^[0-9]*[.]?[0-9]*$"
                title="Please enter a valid number"
              />
              <Button
                type="submit"
                disabled={isLoading || !memeHash || !isValidWagerAmount(wagerAmount)}
              >
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Pick Meme'}
              </Button>
            </div>
          </form>

          {/* User Rewards */}
          {typeof userRewards === 'bigint' && userRewards > 0n && (
            <div className="space-y-2">
              <h3 className="text-lg font-medium">Your Rewards</h3>
              <p className="text-xl font-bold">{formatBigInt(userRewards)} GRASS</p>
              <Button
                onClick={handleClaimReward}
                disabled={isLoading}
                className="w-full"
              >
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Claim Rewards'}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default UserPanel;
