import { useEffect, useState } from "react";
import { chains } from "@lens-network/sdk/viem";
import { custom, useAccount, useSignMessage } from "wagmi";
import { AccountManaged, evmAddress } from "@lens-protocol/client";
import { handleWith } from "@lens-protocol/client/viem";
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
import { CircleArrowRight } from "lucide-react";
import { client } from "./client";
import SignUp from "./components/SignUp";
import LoadingSpinner from "./components/LoadingSpinner";
import { Account } from "./types/account";
import { useSessionClient } from "./context/sessionContext";
import { useNavigate } from 'react-router-dom';


const LensAuth = () => {
  // Hooks
  const { address } = useAccount();
  const { signMessageAsync } = useSignMessage();
  const [userName, setUserName] = useState("");
  const { sessionClient, setSessionClient, loggedInUsername, setLoggedInUsername, setAuthenticatedValue } = useSessionClient();
  const navigate = useNavigate();

  const [state, setState] = useState({
    error: "",
    isAuthenticated: false,
    availableUsers: [] as AccountManaged[],
    isLoading: false,
    showSignUp: false
  });

  // Utility Functions
  const setError = (error: string) => setState((prev) => ({ ...prev, error }));
  const setIsAuthenticated = (isAuthenticated: boolean) =>
    setState((prev) => ({ ...prev, isAuthenticated }));
  
  const setAvailableUsers = (availableUsers: AccountManaged[]) =>
    setState((prev) => ({ ...prev, availableUsers }));
  const setIsLoading = (isLoading: boolean) =>
    setState((prev) => ({ ...prev, isLoading }));
    

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
      setSessionClient(credentials);
      const authenticatedUser = await credentials.getAuthenticatedUser().match(
        (result) => result,
        (error) => {
          throw error;
        }
      );
      setAuthenticatedValue(authenticatedUser.authentication_id);
      setLoggedInUsername(account.username.value);
      setIsAuthenticated(true);
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
          },
        );
  
      setSessionClient(sessionClient);
      setIsAuthenticated(true);
  
      console.log("Successfully authenticated with Lens!", sessionClient);
  
      const { uri } = await storageClient.uploadFile(
        new File([JSON.stringify(metadata)], "metadata.json", {
          type: "application/json",
        }),
      );
  
      const newSessionClient = await createAccountWithUsername(sessionClient, {
        metadataUri: uri,
        username: {
          localName: `${userName}${Date.now()}`, // Make username unique
        },
      })
        .andThen(handleWith(walletClient))
        .andThen(sessionClient.waitForTransaction)
        .andThen((txHash) => fetchAccount(sessionClient, { txHash }))
        .andThen((account) => 
          sessionClient.switchAccount({
            account: account?.address,
          })
        )
        .match(
          (result) => result,
          (error) => {
            throw error;
          },
        );
  
      // Now you must use the new session client going forward
      setSessionClient(newSessionClient);
  
      console.log(newSessionClient.getAuthenticatedUser());
  
      const authenticatedUser = await newSessionClient
        .getAuthenticatedUser()
        .match(
          (result) => result,
          (error) => {
            throw error;
          },
        );
  
      const newAccount = await fetchAccount(newSessionClient, {
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
    } catch (err) {
      setSessionClient(null);
      const errorMessage =
        err instanceof Error ? err.message : "Failed to authenticate with Lens";
      setError(errorMessage);
      console.error(err);
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
    if (sessionClient && loggedInUsername) {
      console.log("Navigation triggered with session:", sessionClient);
      navigate('/protected');
    }
  }, [sessionClient, loggedInUsername, navigate]);

  // Render Functions
  const renderContent = () => {
    if (state.isLoading) {
      return (
        <div className="h-96 w-full flex items-center justify-center">
          <LoadingSpinner />
        </div>
      );
    }

    // Show account selection if we have available users and not in signup mode
    if (state.availableUsers.length > 0 && !state.showSignUp) {
      return (
        <div className="w-full max-w-2xl mx-auto">
          {/* Header Section */}
          <div className="text-2xl font-bold text-gray-800 mb-6 text-center">
            Choose Your Account
          </div>

          {/* Account List */}
          <div className="relative">
            <div className="max-h-[400px] overflow-y-auto pr-2 space-y-2 
            scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
              {state.availableUsers.map((val, i) => (
                <div
                  key={i}
                  className="w-full"
                >
                  <button
                    onClick={() => loginWithAccount(val.account)}
                    className="w-full group border border-gray-300 hover:border-purple-600 
                    bg-white hover:bg-gradient-to-r from-purple-100 to-purple-50
                    rounded-tl-xl rounded-br-xl transition-all duration-200 ease-in-out 
                    py-3 px-4 flex items-center justify-between"
                  >
                    <span className="text-base font-medium text-gray-800 truncate max-w-[80%]">
                      {val.account.username?.value?.replace(/^lens\//, '') || ''}
                    </span>
                    
                    <div className="text-purple-600 opacity-0 group-hover:opacity-100 
                    transform group-hover:translate-x-1 transition-all duration-200">
                      <CircleArrowRight className="w-5 h-5" />
                    </div>
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Footer Section */}
          <div className="mt-6 flex flex-col items-center gap-4">
            <p className="text-sm text-gray-500">
              Select your account to continue to the platform
            </p>
            
            <div className="w-full border-t border-gray-200 pt-4">
              <button
                onClick={() => setState(prev => ({ 
                  ...prev, 
                  showSignUp: true
                }))}
                className="w-full group border border-gray-300 hover:border-purple-600 
                bg-white hover:bg-gradient-to-r from-purple-100 to-purple-50
                rounded-tl-xl rounded-br-xl transition-all duration-200 ease-in-out 
                py-3 px-4 flex items-center justify-center gap-2"
              >
                <span className="text-gray-700 group-hover:text-purple-700 font-medium">
                  Create Another Account
                </span>
                <svg 
                  className="w-4 h-4 text-gray-500 group-hover:text-purple-600"
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M12 4v16m8-8H4" 
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      );
    }

    // Show signup form
    return (
      <div className="w-full mx-auto">
        <SignUp 
          setUserName={setUserName} 
          handleOnboarding={handleOnboarding}
          hasExistingAccounts={state.availableUsers.length > 0}
          onLoginInstead={() => {
            setState(prev => ({
              ...prev,
              showSignUp: false
            }));
          }}
        />
      </div>
    );
  };

  return <div className="p-4 space-y-4">{renderContent()}</div>;
};

export default LensAuth;
