import { useSessionClient } from "../context/sessionContext";
import { revokeAuthentication } from "@lens-protocol/client/actions";
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import LoadingSpinner from "./LoadingSpinner";
import { useBalance } from 'wagmi';
import { useMemeMelee } from "../hooks/useMemeMelee";
// import TransferEvents from "./InOutTransfer";

const DEFAULT_AVATAR = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23ccc'%3E%3Cpath d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z'/%3E%3C/svg%3E";

const Profile = () => {
  const { 
    loggedInUsername, 
    sessionClient, 
    authenticatedValue, 
    setSessionClient, 
    setLoggedInUsername, 
    setAuthenticatedValue,
    activeLensAddress 
  } = useSessionClient();
  
  const { claimBalanceLens } = useMemeMelee();
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isClaiming, setIsClaiming] = useState(false);
  const [copied, setCopied] = useState(false);

  const { data: balance, isError, isLoading } = useBalance({
    address: activeLensAddress,
  });

  const formatUsername = (username: string) => {
    return username.replace(/^lens\//, '');
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await revokeAuthentication(sessionClient, {
        authenticationId: authenticatedValue
      });
      setSessionClient(null);
      setLoggedInUsername('');
      setAuthenticatedValue('');
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  const handleClaim = async () => {
    setIsClaiming(true);
    try {
      await claimBalanceLens();
    } catch (error) {
      console.error('Claim error:', error);
    } finally {
      setIsClaiming(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <div className="flex items-center justify-between p-4 bg-white/10 rounded-lg shadow-sm">
        <div className="flex items-center gap-3">
          <img
            src={DEFAULT_AVATAR}
            alt=""
            className="w-10 h-10 rounded-full object-cover border-2 border-gray-200"
          />
          <div className="text-lg font-medium">@{formatUsername(loggedInUsername)}</div>
        </div>

        <button
          onClick={handleLogout}
          disabled={isLoggingOut}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl
                   font-medium text-sm tracking-wide
                   transition-all duration-300
                   ${isLoggingOut
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-rose-400 to-red-500 text-white ' +
              'hover:from-rose-500 hover:to-red-600 ' +
              'hover:shadow-[0_0_12px_rgb(251_113_133_/_24%)] ' +
              'active:opacity-90'
            }`}
        >
          {isLoggingOut ? <LoadingSpinner size="small" /> : (
            <>
              <span>Sign out</span>
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </>
          )}
        </button>
      </div>

      {/* Balance and Transaction Section */}
      <div className=" gap-6 p-3 ">
        {/* Balance Card */}
        <div className="p-3 bg-white/10 rounded-lg backdrop-blur-sm shadow-sm border border-gray-300">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium">Your Balance</h2>
            <div className="p-2 rounded-full bg-white/5">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>

          {/* Wallet Address */}
          <div className="p-3 bg-white/5 rounded-lg">
          <div className="text-md px-2">Smart Wallet</div>
            <div 
              className="flex items-center gap-2 cursor-pointer hover:bg-white/5 p-2 rounded"
              onClick={() => activeLensAddress && copyToClipboard(activeLensAddress)}
            >
              <span className="text-sm font-mono">
                {activeLensAddress?.slice(0, 6)}...{activeLensAddress?.slice(-4)}
              </span>
              <div className="flex items-center gap-2">
                {copied ? (
                  <span className="text-xs text-green-400">Copied!</span>
                ) : (
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                  </svg>
                )}
              </div>
            </div>
          </div>

          {/* Balance Display */}
          {isLoading ? (
            <div className="flex justify-center ">
              <LoadingSpinner size="medium" />
            </div>
          ) : isError ? (
            <div className="text-center">Error fetching balance</div>
          ) : (
            <div className="mb-6 p-3 bg-white/5 rounded-lg">
              <div className="text-sm text-gray-400 mb-1">Available Balance</div>
              <div className="text-3xl font-bold">{balance?.formatted}</div>
              <div className="text-sm text-gray-400">{balance?.symbol}</div>
            </div>
          )}

          <button
            onClick={handleClaim}
            disabled={isClaiming}
            className={`w-full flex items-center justify-center gap-2 px-6 py-3 
                     rounded-xl font-medium tracking-wide
                     transition-all duration-300
                     ${isClaiming
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white ' +
              'hover:from-purple-600 hover:to-indigo-600 ' +
              'hover:shadow-[0_0_12px_rgba(139,92,246,0.3)] ' +
              'active:opacity-90'
            }`}
          >
            {isClaiming ? <LoadingSpinner size="small" /> : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
                </svg>
                <span>{activeLensAddress ? 'Claim To EOA Wallet' : 'Claim Rewards'}</span>
              </>
            )}
          </button>
        </div>

        {/* Transaction History Card */}
        {/* <div className="p-6 bg-white/10 rounded-lg backdrop-blur-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-medium">Recent Transactions</h2>
            <div className="p-2 rounded-full bg-white/5">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
          </div>
          <div className="overflow-hidden">
            <TransferEvents />
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default Profile;
