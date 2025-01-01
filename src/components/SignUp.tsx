import { useState } from "react";
import LoadingSpinner from "./LoadingSpinner";

type SignUpProps = {
  setUserName: (name: string) => void;
  handleOnboarding: () => void;
};

const SignUp = ({ setUserName, handleOnboarding }: SignUpProps) => {
  const [userNameLocal, setUserNameLocal] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      setUserName(userNameLocal);
      handleOnboarding();
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
    <form className="flex gap-4 p-4">
      <div className="relative w-fit group">
        <div className="-skew-x-[10deg] transition-transform duration-300 hover:scale-105">
          <input
            type="text"
            value={userNameLocal}
            className="w-64 px-4 py-2 border-2 border-black bg-white transition-all duration-300
                     focus:outline-none focus:border-blue-500 focus:shadow-lg"
            onChange={(e) => setUserNameLocal(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
          />
          {/* Animated border gradient */}
          <div
            className={`absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500
                        transition-opacity duration-300 -z-10 blur-sm
                        ${isFocused ? "opacity-100" : "opacity-0"}`}
          />
        </div>
        {userNameLocal.length === 0 && (
          <div
            className={`absolute top-0 left-0 px-4 py-2 text-gray-400
                        transition-all duration-300 transform
                        ${isFocused ? "-translate-y-6 text-blue-500 text-sm" : ""}`}
          >
            Username
          </div>
        )}
        {/* Ripple effect indicator */}
        <div
          className={`absolute -bottom-1 left-1/2 w-2 h-2 bg-blue-500 rounded-full
                      transition-all duration-300 transform -translate-x-1/2
                      ${isFocused ? "scale-100" : "scale-0"}`}
        >
          <div className="absolute inset-0 bg-blue-400 rounded-full animate-ping opacity-75" />
        </div>
      </div>

      <button
        className="w-24 px-4 py-2 bg-blue-500 text-white -skew-x-[10deg]
                 transition-all duration-300 transform hover:scale-110
                 hover:bg-blue-600 hover:shadow-lg active:scale-95
                 relative overflow-hidden group"
        type="submit"
        onClick={handleClick}
      >
        <span className="relative z-10">Click</span>
        {/* Button hover effect */}
        <div
          className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600
                     transition-transform duration-500 transform translate-x-full
                     group-hover:translate-x-0"
        />
      </button>
    </form>
  );
};

export default SignUp;
