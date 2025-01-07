import { useState } from "react";
import LoadingSpinner from "./LoadingSpinner";
import {useAccount} from "wagmi";

type SignUpProps = {
  setUserName: (name: string) => void;
  handleOnboarding: () => Promise<void>;
  hasExistingAccounts: boolean;
  onLoginInstead: () => void;
};

const SignUp = ({ 
  setUserName, 
  handleOnboarding, 
  hasExistingAccounts,
  onLoginInstead 
}: SignUpProps) => {
  const [userNameLocal, setUserNameLocal] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { isDisconnected } = useAccount();

  const handleClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      setUserName(userNameLocal);
      await handleOnboarding();
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitting) {
    return (
      <div className="h-96 w-full flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <>
      {!isDisconnected && (
        <div className="max-w-md mx-auto p-6">
          <div className="text-3xl font-black techno mb-6">You are not signed in!</div>
          <form className="space-y-6">
            <div className="space-y-6">
              <div className="relative">
                <div className="relative group bg-white/10 
                              rounded-lg p-1.5 border-2 border-gray-300/50 
                              hover:border-blue-500/50 transition-all duration-300
                              focus-within:border-blue-500 focus-within:shadow-md">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>

                  <input
                    type="text"
                    value={userNameLocal}
                    className="w-full bg-transparent pl-10 pr-12 py-2.5 text-gray-700
                             text-base outline-none placeholder:text-gray-500"
                    placeholder="Choose your username"
                    onChange={(e) => setUserNameLocal(e.target.value)}
                  />

                  <div className="absolute right-3 top-1/2 -translate-y-1/2 
                                text-xs text-gray-500">
                    {userNameLocal.length}/20
                  </div>
                </div>
              </div>

              {/* Sign Up Button */}
              <button
                disabled={userNameLocal.length === 0}
                onClick={handleClick}
                type="submit"
                className={`w-full relative flex items-center justify-center 
                         px-8 py-4 rounded-xl font-medium text-sm
                         transition-all duration-300 transform
                         ${userNameLocal.length === 0
                           ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                           : 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:translate-y-[-2px] hover:shadow-lg'
                         }`}
              >
                <span className="relative flex items-center gap-2">
                  {userNameLocal.length === 0 ? (
                    <>
                      <span>Enter Username</span>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                              d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                    </>
                  ) : (
                    <>
                      <span>Let's Begin</span>
                      <svg className="w-4 h-4 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                              d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </>
                  )}
                </span>
              </button>

              {/* Login Instead Button */}
              {hasExistingAccounts && (
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    onLoginInstead();
                  }}
                  className="w-full group border border-gray-300 hover:border-purple-600 
                  bg-white hover:bg-gradient-to-r from-purple-100 to-purple-50
                  rounded-tl-xl rounded-br-xl transition-all duration-200 ease-in-out 
                  py-3 px-4 flex items-center justify-center gap-2"
                >
                  <span className="text-gray-700 group-hover:text-purple-700 font-medium">
                    Login Instead
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
                      d="M17 8l4 4m0 0l-4 4m4-4H3" 
                    />
                  </svg>
                </button>
              )}
            </div>

            <p className="text-sm text-gray-500 text-center mt-2">
              Choose a unique username to get started
            </p>
          </form>
        </div>
      )}
    </>
  );
};

export default SignUp;
