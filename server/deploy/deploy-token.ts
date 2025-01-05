import { deployContract, getWallet } from "./utils";
import { HardhatRuntimeEnvironment } from "hardhat/types";

export default async function(hre: HardhatRuntimeEnvironment) {
  const wallet = getWallet();

  const MemeMeleeContract = await deployContract("MemeMelee", ["0x000000000000000000000000000000000000800A"], {
    hre,
    wallet,
    verify: true,
  });
  console.log(await MemeMeleeContract.getAddress());
}
