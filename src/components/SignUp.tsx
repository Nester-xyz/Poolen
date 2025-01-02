import { useState } from "react";
import LoadingSpinner from "./LoadingSpinner";
import {useAccount} from "wagmi";

type SignUpProps = {
  setUserName: (name: string) => void;
  handleOnboarding: () => Promise<void>;
};

const SignUp = ({ setUserName, handleOnboarding }: SignUpProps) => {
  const [userNameLocal, setUserNameLocal] = useState("");
  const [isFocused, setIsFocused] = useState(false);
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
          <form className="space-y-6">
            <div className="relative group">
              <input
                type="text"
                value={userNameLocal}
                className="peer w-full px-4 py-3 rounded-lg border-2 border-gray-300 
                         bg-white/5 backdrop-blur-sm transition-all duration-300
                         focus:outline-none focus:border-blue-500 focus:ring-2 
                         focus:ring-blue-500/30 placeholder-transparent"
                placeholder="Username"
                onChange={(e) => setUserNameLocal(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
              />
              <label
                className="absolute left-4 -top-2.5 bg-white px-2 text-sm 
                         transition-all duration-300 text-gray-600
                         peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 
                         peer-placeholder-shown:top-3.5 peer-focus:-top-2.5 
                         peer-focus:text-sm peer-focus:text-blue-500"
              >
                Choose your username
              </label>
              
              {/* Animated underline effect */}
              <div className="absolute bottom-0 left-0 h-0.5 w-0 
                            bg-gradient-to-r from-blue-500 to-purple-600 
                            transition-all duration-300 group-hover:w-full"/>
            </div>

            <button
              disabled={userNameLocal.length === 0}
              onClick={handleClick}
              type="submit"
              className={`w-full relative inline-flex items-center justify-center 
                       px-8 py-3 overflow-hidden font-medium rounded-lg 
                       transition-all duration-300 ease-in-out shadow-lg
                       group/btn ${
                         userNameLocal.length === 0
                           ? 'bg-gray-300 cursor-not-allowed text-gray-500'
                           : 'bg-gradient-to-br from-blue-500 to-purple-600 text-white hover:scale-[1.02]'
                       }`}
            >
              <span className="relative flex items-center gap-2">
                {userNameLocal.length === 0 ? (
                  <>
                    <span>Enter Username</span>
                    <svg 
                      className="w-5 h-5" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                      />
                    </svg>
                  </>
                ) : (
                  <>
                    <span>Let's Begin</span>
                    <svg 
                      className="w-5 h-5 animate-bounce" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M14 5l7 7m0 0l-7 7m7-7H3"
                      />
                    </svg>
                  </>
                )}
              </span>
              
              {/* Shine effect */}
              <div className="absolute inset-0 w-full h-full 
                            bg-gradient-to-br from-white/20 to-transparent 
                            opacity-0 group-hover/btn:opacity-100 
                            transition-opacity duration-300"/>
            </button>

            {/* Optional helper text */}
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
