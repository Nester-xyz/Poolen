import { ConnectKitButton } from "connectkit";
import LensAuth from "../LensAuth";

const Connect = () => {
  return (
    <div className="flex flex-col h-screen justify-center items-center">
      <ConnectKitButton />
      <LensAuth />
    </div>
  );
};

export default Connect;
