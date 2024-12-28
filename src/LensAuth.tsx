import "viem/window";

import { useEffect, useState } from "react";
import { chains } from "@lens-network/sdk/viem";
import { custom, useAccount, useSignMessage } from "wagmi";
import { evmAddress } from "@lens-protocol/client";
import { handleWith } from "@lens-protocol/client/viem";
// import { fetchAccount } from '@lens-protocol/client/actions';
import {
  PublicClient,
  testnet as protocolTestnet,
} from "@lens-protocol/client";
import {
  createAccountWithUsername,
  fetchAccount,
  fetchAccountsAvailable,
} from "@lens-protocol/client/actions";
import { account } from "@lens-protocol/metadata";
import {
  StorageClient,
  testnet as storageEnv,
} from "@lens-protocol/storage-node-client";
import { createWalletClient } from "viem";
import { client } from "./client";
import SignUp from "./components/SignUp";

const LensAuth = () => {
  const { address } = useAccount();
  const { signMessageAsync } = useSignMessage();
  const [error, setError] = useState<string>("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [availableUsers, setAvailableUsers] = useState([]);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const fetchAllUser = async () => {
      console.log("fetchCalled");
      try {
        const response = await fetchAccountsAvailable(client, {
          managedBy: evmAddress(address!),
        });
        console.log(response.value.items);
        return response.value.items; // Return directly here
      } catch (err) {
        return err; // This return is fine
      }
    };
    fetchAllUser().then((res) => setAvailableUsers(res));
  }, [address]);

  // Only create clients if address exists
  const getClients = () => {
    if (!address) {
      return null;
    }

    const storageClient = StorageClient.create(storageEnv);
    const chain = chains.testnet;
    const metadata = account({
      name: userName || "checking user",
    });

    const walletClient = createWalletClient({
      account: evmAddress(address),
      chain,
      transport: custom(window.ethereum),
    });

    const client = PublicClient.create({
      environment: protocolTestnet,
    });

    return { storageClient, chain, metadata, walletClient, client };
  };

  // Handle Lens authentication
  const handleLensLogin = async () => {
    if (!address) {
      setError("Please connect your wallet first");
      return;
    }

    try {
      const clients = getClients();

      if (!clients) {
        setError("Failed to initialize clients");
        return;
      }

      const { storageClient, walletClient, client, metadata } = clients;

      const sessionClient = await client
        .login({
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
          },
        );

      setIsAuthenticated(true);
      console.log("Successfully authenticated with Lens!", sessionClient);

      const { uri } = await storageClient.uploadFile(
        new File([JSON.stringify(metadata)], "metadata.json", {
          type: "application/json",
        }),
      );

      const createAccountResult = await createAccountWithUsername(
        sessionClient,
        {
          metadataUri: uri,
          username: {
            localName: `${userName}${Date.now()}`, // Make username unique
          },
        },
      )
        .andThen(handleWith(walletClient))
        .andThen(sessionClient.waitForTransaction)
        .andThen((txHash) => fetchAccount(sessionClient, { txHash }))
        .match(
          (result) => result,
          (error) => {
            throw error;
          },
        );

      console.log(createAccountResult);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to authenticate with Lens";
      setError(errorMessage);
      console.error(err);
    }
  };

  return (
    <div className="p-4 space-y-4">
      {availableUsers.length > 0 ? (
        <div className="h-96 overflow-scroll flex flex-col gap-2 border p-2 ">
          {availableUsers.map((val, i) => {
            return (
              <div key={i} className="p-2 bg-green-100 text-green-800 rounded">
                {val.account.username.value}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="w-8/12 mx-auto">
          <div className="text-6xl text-balance font-black techno">
            You are not signed in
          </div>
          <SignUp setUserName={setUserName} handleLensLogin={handleLensLogin} />
        </div>
      )}

      {error && (
        <div className="p-2 bg-red-100 text-red-800 rounded">{error}</div>
      )}
    </div>
  );
};

export default LensAuth;
