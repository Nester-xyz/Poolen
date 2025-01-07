import { useSessionClient } from "../context/sessionContext";
import { revokeAuthentication } from "@lens-protocol/client/actions";
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import LoadingSpinner from "./LoadingSpinner";
import ProfileBalance from "./ProfileBalance";
import TransferEvents from "./InOutTransfer";
import ClaimableBalance from "./ClaimableBalance";

const DEFAULT_AVATAR = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23ccc'%3E%3Cpath d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z'/%3E%3C/svg%3E";

const Profile = () => {
  const { loggedInUsername, sessionClient, authenticatedValue, setSessionClient, setLoggedInUsername, setAuthenticatedValue } = useSessionClient();
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const formatUsername = (username: string) => {
    return username.replace(/^lens\//, '');
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      const result = await revokeAuthentication(sessionClient, {
        authenticationId: authenticatedValue
      });
      console.log(result);

      // Clear all session data
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

  const avatar = DEFAULT_AVATAR;

  return (
    <div>
      <div className="flex items-center justify-between p-4 bg-white/10 rounded-lg shadow-sm">
        <div className="flex items-center gap-3">
          <img
            src={avatar}
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
          {isLoggingOut ? (
            <LoadingSpinner size="small" />
          ) : (
            <>
              <span>Sign out</span>
              <svg
                className="w-4 h-4 transition-transform duration-200"
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
      <div>
        <ProfileBalance />
      </div>
      <div>
        <TransferEvents />
      </div>
      <div>
        <ClaimableBalance />
      </div>
    </div>
  );
};

export default Profile;
