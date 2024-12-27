import { ConnectKitButton } from "connectkit";
import LensAuth from "../LensAuth";
import SignUp from "./SignUp";
import { useState } from "react";

const Connect = () => {
  const [isSignedIn, setIsSignedIn] = useState(true);
  return (
    <div className="flex flex-col h-screen justify-center items-center">

      <ConnectKitButton />
      <LensAuth />
      {
        isSignedIn ? (
          <div className="w-8/12">
            <div className="text-6xl text-balance font-black techno">
              You are not signed in
            </div>
            <button onClick={() => setIsSignedIn(false)} className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg w-full">
              Sign Up
            </button>
          </div>
        ) : (
          <SignUp />
        )
      }
    </div>
  );
};

export default Connect;
