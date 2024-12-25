import { ConnectKitButton } from "connectkit";
import LensAuth from "../LensAuth";

const Connect = () => {
  return (
    <div className="flex flex-col justify-center items-center h-screen">
      <ConnectKitButton />
      <LensAuth />
    </div>
  );
};

export default Connect