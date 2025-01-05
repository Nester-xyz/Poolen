import React, { useState } from 'react';
import { useMemeMelee } from '../hooks/useMemeMelee';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Alert, AlertDescription } from './ui/alert';
import { Loader2 } from 'lucide-react';
import { ethers } from 'ethers';

const AdminPanel = () => {
  const {
    addMeme,
    endRound,
    isAddMemePending,
    isEndRoundPending,
    isAddMemeConfirming,
    isEndRoundConfirming,
    isAddMemeConfirmed,
    isEndRoundConfirmed
  } = useMemeMelee();

  const [memeName, setMemeName] = useState('');
  const [openPrice, setOpenPrice] = useState('');
  const [closePrice, setClosePrice] = useState('');
  const [endMemeHash, setEndMemeHash] = useState('');

  const handleAddMeme = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!memeName || !openPrice) return;
    try {
      const openPriceBigInt = ethers.parseEther(openPrice);
      await addMeme(memeName, openPriceBigInt);
    } catch (error) {
      console.error('Error adding meme:', error);
      alert(error instanceof Error ? error.message : 'Failed to add meme');
    }
  };

  const handleEndRound = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!endMemeHash || !closePrice) return;
    try {
      const closePriceBigInt = ethers.parseEther(closePrice);
      await endRound(endMemeHash, closePriceBigInt);
    } catch (error) {
      console.error('Error ending round:', error);
      alert(error instanceof Error ? error.message : 'Failed to end round');
    }
  };

  const isLoading = isAddMemePending || isEndRoundPending || isAddMemeConfirming || isEndRoundConfirming;

  return (
    <div className="space-y-6 p-6">
      <Card>
        <CardHeader>
          <CardTitle>Admin Panel</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {isAddMemeConfirmed && (
            <Alert className="mb-4">
              <AlertDescription>Meme added successfully!</AlertDescription>
            </Alert>
          )}

          {isEndRoundConfirmed && (
            <Alert className="mb-4">
              <AlertDescription>Round ended successfully!</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleAddMeme} className="space-y-4">
            <div className="space-y-2">
              <h3 className="text-lg font-medium">Add New Meme</h3>
              <Input
                type="text"
                placeholder="Meme Name"
                value={memeName}
                onChange={(e) => setMemeName(e.target.value)}
                disabled={isLoading}
              />
              <Input
                type="number"
                placeholder="Open Price"
                value={openPrice}
                onChange={(e) => setOpenPrice(e.target.value)}
                disabled={isLoading}
              />
              <Button type="submit" disabled={isLoading || !memeName || !openPrice}>
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Add Meme
              </Button>
            </div>
          </form>

          <form onSubmit={handleEndRound} className="space-y-4">
            <div className="space-y-2">
              <h3 className="text-lg font-medium">End Round</h3>
              <Input
                type="text"
                placeholder="Meme Hash"
                value={endMemeHash}
                onChange={(e) => setEndMemeHash(e.target.value)}
                disabled={isLoading}
              />
              <Input
                type="number"
                placeholder="Close Price"
                value={closePrice}
                onChange={(e) => setClosePrice(e.target.value)}
                disabled={isLoading}
              />
              <Button type="submit" disabled={isLoading || !endMemeHash || !closePrice}>
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                End Round
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminPanel;
