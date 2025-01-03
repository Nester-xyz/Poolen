import { useEffect, useState } from "react";
import { chains } from "@lens-network/sdk/viem";
import { custom, useAccount, useSignMessage } from "wagmi";
import { AccountManaged, evmAddress } from "@lens-protocol/client";
import { handleWith } from "@lens-protocol/client/viem";
import { revokeAuthentication } from "@lens-protocol/client/actions";
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
import { ethers } from "ethers";
import { CircleArrowRight, LogOut } from "lucide-react";
import { client } from "./client";
import SignUp from "./components/SignUp";
import AccountSuccess from "./components/AccountSuccess";
import LoadingSpinner from "./components/LoadingSpinner";
import { Account } from "./types/account";
import { useSessionClient } from "./context/sessionContext";
import { useNavigate } from 'react-router-dom';


const LensAuth = () => {
  // Hooks
  const { address } = useAccount();
  const { signMessageAsync } = useSignMessage();
  const [userName, setUserName] = useState("");
  const { sessionClient, setSessionClient } = useSessionClient();
  const navigate = useNavigate();

  const [state, setState] = useState({
    error: "",
    isAuthenticated: false,
    availableUsers: [] as AccountManaged[],
    loggedInUsername: "",
    isLoading: false,
    authenticatedValue: "",
  });

  // Utility Functions
  const setError = (error: string) => setState((prev) => ({ ...prev, error }));
  const setIsAuthenticated = (isAuthenticated: boolean) =>
    setState((prev) => ({ ...prev, isAuthenticated }));
  const setLoggedInUsername = (loggedInUsername: string) =>
    setState((prev) => ({ ...prev, loggedInUsername }));
  const setAvailableUsers = (availableUsers: AccountManaged[]) =>
    setState((prev) => ({ ...prev, availableUsers }));
  const setIsLoading = (isLoading: boolean) =>
    setState((prev) => ({ ...prev, isLoading }));
  const setAuthenticatedValue = (authenticatedValue: string) =>
    setState((prev) => ({ ...prev, authenticatedValue }));
    

  const getClients = () => {
    if (!address) return null;

    return {
      storageClient: StorageClient.create(storageEnv),
      chain: chains.testnet,
      metadata: account({ name: userName }),
      walletClient: createWalletClient({
        account: evmAddress(address),
        chain: chains.testnet,
        transport: custom(window.ethereum),
      }),
    };
  };

  const loginWithAccount = async (account: Account) => {
    if (!account?.username?.value) {
      setError("No username provided");
      return;
    }

    setIsLoading(true);
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      const credentials = await client
        .login({
          accountOwner: {
            account: account.address,
            app: "0xe5439696f4057aF073c0FB2dc6e5e755392922e1",
            owner: await signer.getAddress(),
          },
          signMessage: (message) => signer.signMessage(message),
        })
        .match(
          (result) => result,
          (error) => {
            throw error;
          }
        );

      // Set session client first
      setSessionClient(credentials);
      
      const authenticatedUser = await credentials.getAuthenticatedUser().match(
        (result) => result,
        (error) => {
          throw error;
        }
      );

      // Then update other state
      setAuthenticatedValue(authenticatedUser.authentication_id);
      setLoggedInUsername(account.username.value);
      setIsAuthenticated(true);

      // Log the state after setting everything
      console.log("Login successful:", {
        sessionClient: credentials,
        username: account.username.value,
        isAuthenticated: true
      });

    } catch (err) {
      console.error("Login error:", err);
      setError(err instanceof Error ? err.message : "Failed to login");
      setSessionClient(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOnboarding = async () => {
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

      const { storageClient, walletClient, metadata } = clients;

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
          }
        );

      setSessionClient(sessionClient);
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
        .andThen((account) =>
          sessionClient.switchAccount({
            account: account?.address,
          }),
        )
        .match(
          (result) => result,
          (error) => {
            throw error;
          },
        );
      setSessionClient(sessionClient);

      console.log(createAccountResult.getAuthenticatedUser());
      const authenticatedUser = await createAccountResult
        .getAuthenticatedUser()
        .match(
          (result) => result,
          (error) => {
            throw error;
          },
        );
      const newAccount = await fetchAccount(sessionClient, {
        address: (authenticatedUser as any).account,
      });
      console.log(newAccount);
      setAuthenticatedValue(newAccount.username?.value);
      const accountData = newAccount.match(
        (result) => result,
        (error) => {
          throw error;
        },
      );
      if (accountData) {
        setLoggedInUsername(accountData.username?.value);
        setIsAuthenticated(true);
      }
      //       console.log(createAccountResult);
    } catch (err) {
      setSessionClient(null);
      const errorMessage =
        err instanceof Error ? err.message : "Failed to authenticate with Lens";
      setError(errorMessage);
      console.error(err);
    }
  };

  const handleLogout = async () => {
    try {
      if (sessionClient) {
        const logoutRes = await revokeAuthentication(sessionClient, {
          authenticationId: state.authenticatedValue,
        });
        console.log(logoutRes);
      }

      setSessionClient(null);
      setIsAuthenticated(false);
      setLoggedInUsername("");
      setAuthenticatedValue("");

      // Fetch available accounts again after logout
      const response = await fetchAccountsAvailable(client, {
        managedBy: evmAddress(address!),
      });
      setAvailableUsers(response.value.items);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to logout");
    }
  };

  // Effects
  useEffect(() => {
    const fetchAllUser = async () => {
      setIsLoading(true);
      try {
        const response = await fetchAccountsAvailable(client, {
          managedBy: evmAddress(address!),
        });
        return response.value.items;
      } catch (err) {
        return err;
      } finally {
        setIsLoading(false);
      }
    };
    fetchAllUser().then((res) => setAvailableUsers(res));
  }, [address]);

  useEffect(() => {
    if (sessionClient && state.loggedInUsername) {
      console.log("Navigation triggered with session:", sessionClient);
      navigate('/protected');
    }
  }, [sessionClient, state.loggedInUsername, navigate]);

  // Render Functions
  const renderContent = () => {
    if (state.isLoading) {
      return (
        <div className="h-96 w-full flex items-center justify-center">
          <LoadingSpinner />
        </div>
      );
    }

    if (state.isAuthenticated && state.loggedInUsername) {
      return (
        <div className="flex flex-col gap-4 items-center justify-center">
          <div>
            <AccountSuccess username={state.loggedInUsername} />
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center justify-center gap-2 bg-red-500 text-white p-2 rounded-md"
          >
            <div className="text-lg">Logout</div> <LogOut className="w-4 h-4" />
          </button>
        </div>
      );
    }

    if (state.availableUsers.length > 0) {
      return (
        <div className="h-96 w-80 overflow-scroll flex flex-col gap-2 border p-2">
          <div className="text-2xl font-bold text-center">LOGIN AS</div>
          {state.availableUsers.map((val, i) => (
            <div
              key={i}
              className="p-2 bg-green-100 text-green-800 rounded flex justify-between"
            >
              {val.account.username?.value}
              <div
                className="cursor-pointer"
                onClick={() => loginWithAccount(val.account)}
              >
                <CircleArrowRight />
              </div>
            </div>
          ))}
        </div>
      );
    }

    // if (!state.isAuthenticated)
    return (
      <div className="w-full mx-auto">
        <div className="text-3xl font-black techno">You are not signed in</div>
        <SignUp setUserName={setUserName} handleOnboarding={handleOnboarding} />
        {state?.availableUsers[0]?.account.username?.value}
      </div>
    );

    return null;
  };

  return <div className="p-4 space-y-4">{renderContent()}</div>;
};

export default LensAuth;
