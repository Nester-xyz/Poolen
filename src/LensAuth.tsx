import 'viem/window'

import {  useState, } from 'react';
import {chains} from "@lens-network/sdk/viem"
import { custom, useAccount, useSignMessage } from 'wagmi';
import {evmAddress} from "@lens-protocol/client"
import { handleWith } from "@lens-protocol/client/viem";
// import { fetchAccount } from '@lens-protocol/client/actions';
import {PublicClient, testnet as protocolTestnet} from "@lens-protocol/client"
import { createAccountWithUsername, fetchAccount } from '@lens-protocol/client/actions';
import { account } from "@lens-protocol/metadata";
import { StorageClient, testnet as storageEnv } from "@lens-protocol/storage-node-client";
import { createWalletClient } from 'viem';




const LensAuth = () => {
  const { address } = useAccount();
  const { signMessageAsync } = useSignMessage();
  const [error, setError] = useState<string>('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Only create clients if address exists
  const getClients = () => {
    if (!address) {
      return null;
    }

    const storageClient = StorageClient.create(storageEnv);
    const chain = chains.testnet;
    const metadata = account({
      name: "Ankit Doe",
    });

    const walletClient = createWalletClient({
      account: evmAddress(address),
      chain,
      transport: custom(window.ethereum)
    });

    const client = PublicClient.create({
      environment: protocolTestnet,
    });

    return { storageClient, chain, metadata, walletClient, client };
  };

  // Handle Lens authentication
  const handleLensLogin = async () => {
    if (!address) {
      setError('Please connect your wallet first');
      return;
    }

    try {
      const clients = getClients();
      if (!clients) {
        setError('Failed to initialize clients');
        return;
      }

      const { storageClient, walletClient, client, metadata } = clients;

      const sessionClient = await client.login({
        onboardingUser: {
          app: "0xe5439696f4057aF073c0FB2dc6e5e755392922e1",
          wallet: walletClient.account.address,
        },
        signMessage: (message: string) => signMessageAsync({ message }),
      })
      .match(
        (result) => result,
        (error) => {
          throw error;
        }
      );

      setIsAuthenticated(true);
      console.log('Successfully authenticated with Lens!', sessionClient);
      
      const { uri } = await storageClient.uploadFile(
        new File([JSON.stringify(metadata)], 'metadata.json', { type: 'application/json' }),
      );

      const createAccountResult = await createAccountWithUsername(sessionClient, {
        metadataUri: uri,
        username: {
          localName: `ankitbhan${Date.now()}`, // Make username unique
        },
      })
      .andThen(handleWith(walletClient))
      .andThen(sessionClient.waitForTransaction)
      .andThen((txHash) => fetchAccount(sessionClient, {txHash}))
      .match(
        (result) => result,
        (error) => {
          throw error;
        }
      );

      console.log(createAccountResult);

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to authenticate with Lens';
      setError(errorMessage);
      console.error(err);
    }
  };

  return (
    <div className="p-4 space-y-4">
      {address && !isAuthenticated && (
        <button
          onClick={handleLensLogin}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Login with Lens
        </button>
      )}

      {isAuthenticated && (
        <div className="p-2 bg-green-100 text-green-800 rounded">
          Successfully authenticated with Lens!
        </div>
      )}

      {error && (
        <div className="p-2 bg-red-100 text-red-800 rounded">
          {error}
        </div>
      )}
    </div>
  );
};

export default LensAuth;