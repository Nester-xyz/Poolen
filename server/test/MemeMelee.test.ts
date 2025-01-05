import { expect } from "chai";
import { Wallet, Contract } from "zksync-ethers";
import { deployContract } from "../deploy/utils";
import { getWallet, LOCAL_RICH_WALLETS } from "../deploy/utils";
import { ethers } from "ethers";
import { network } from "hardhat";

describe("MemeMelee", function() {
  let memeMelee: Contract;
  let mockToken: Contract;
  let owner: Wallet;
  let user1: Wallet;
  let user2: Wallet;
  let mockTokenAddress: string;
  let memeMeleeAddress: string;

  before(async function() {
    // Initialize wallets
    owner = getWallet(LOCAL_RICH_WALLETS[0].privateKey);
    user1 = getWallet(LOCAL_RICH_WALLETS[1].privateKey);
    user2 = getWallet(LOCAL_RICH_WALLETS[2].privateKey);
  });

  beforeEach(async function() {
    try {
      // Deploy mock token first
      mockToken = await deployContract(
        "MockERC20",
        [],
        { wallet: owner }
      );
      mockTokenAddress = await mockToken.getAddress();
      console.log("Mock token deployed at:", mockTokenAddress);

      // Deploy MemeMelee with mock token address
      memeMelee = await deployContract(
        "MemeMelee",
        [mockTokenAddress],
        { wallet: owner }
      );
      memeMeleeAddress = await memeMelee.getAddress();
      console.log("MemeMelee deployed at:", memeMeleeAddress);

      // Transfer tokens to test users
      const amount = ethers.parseEther("1000");
      await mockToken.transfer(user1.address, amount);
      await mockToken.transfer(user2.address, amount);

      // Approve spending
      await mockToken.connect(user1).approve(memeMeleeAddress, amount);
      await mockToken.connect(user2).approve(memeMeleeAddress, amount);
    } catch (error) {
      console.error("Deployment error:", error);
      throw error;
    }
  });

  describe("Deployment", function() {
    it("Should set the right owner", async function() {
      expect(await memeMelee.owner()).to.equal(owner.address);
    });

    it("Should set the correct GRASS token address", async function() {
      expect(await memeMelee.grassToken()).to.equal(mockTokenAddress);
    });

    it("Should start with round 1 active", async function() {
      expect(await memeMelee.currentRound()).to.equal(1);
      expect(await memeMelee.roundActive()).to.equal(true);
    });
  });

  describe("Meme Management", function() {
    it("Should allow owner to add a meme", async function() {
      const memeName = "Doge";
      const memeHash = ethers.keccak256(ethers.solidityPacked(['string'], [memeName]));
      const openPrice = 100;

      await memeMelee.addMeme(memeName, openPrice);

      const [name, totalWagered, pickCount, memeOpenPrice, closePrice, exists] = await memeMelee.getMemeDetails(memeHash);
      expect(name).to.equal(memeName);
      expect(memeOpenPrice).to.equal(openPrice);
      expect(exists).to.equal(true);
    });

    it("Should not allow adding duplicate memes", async function() {
      const memeName = "Doge";
      await memeMelee.addMeme(memeName, 100);

      await expect(memeMelee.addMeme(memeName, 100))
        .to.be.revertedWithCustomError(memeMelee, "MemeAlreadyExists");
    });

    it("Should emit MemeAdded event", async function() {
      const memeName = "Doge";
      const openPrice = 100;
      const memeHash = ethers.keccak256(ethers.solidityPacked(['string'], [memeName]));

      await expect(memeMelee.addMeme(memeName, openPrice))
        .to.emit(memeMelee, "MemeAdded")
        .withArgs(memeHash, memeName, openPrice);
    });
  });

  describe("Round Management", function() {
    let memeHash: string;

    beforeEach(async function() {
      const memeName = "Doge";
      await memeMelee.addMeme(memeName, 100);
      memeHash = ethers.keccak256(ethers.solidityPacked(['string'], [memeName]));
    });

    it("Should not allow ending round before duration with wagers", async function() {
      const wagerAmount = ethers.parseEther("1");
      await memeMelee.connect(user1).pickMeme(memeHash, wagerAmount);

      await expect(memeMelee.endRound(memeHash, 200))
        .to.be.revertedWithCustomError(memeMelee, "RoundStillActive");
    });

    it("Should not allow ending round with invalid close price", async function() {
      const wagerAmount = ethers.parseEther("1");
      await memeMelee.connect(user1).pickMeme(memeHash, wagerAmount);

      await network.provider.send("evm_increaseTime", [86400]);
      await network.provider.send("evm_mine");

      await expect(memeMelee.endRound(memeHash, 0))
        .to.be.revertedWithCustomError(memeMelee, "InvalidClosePrice");
    });
  });

  describe("Meme Picking", function() {
    let memeHash: string;
    const wagerAmount = ethers.parseEther("1");

    beforeEach(async function() {
      const memeName = "Doge";
      await memeMelee.addMeme(memeName, 100);
      memeHash = ethers.keccak256(ethers.solidityPacked(['string'], [memeName]));
    });

    it("Should allow users to pick memes with sufficient tokens", async function() {
      const initialBalance = await mockToken.balanceOf(user1.address);

      await expect(memeMelee.connect(user1).pickMeme(memeHash, wagerAmount))
        .to.emit(memeMelee, "MemePicked")
        .withArgs(user1.address, memeHash, wagerAmount);

      expect(await mockToken.balanceOf(user1.address)).to.equal(initialBalance - wagerAmount);
    });

    it("Should not allow picking twice in same round", async function() {
      await memeMelee.connect(user1).pickMeme(memeHash, wagerAmount);

      await expect(memeMelee.connect(user1).pickMeme(memeHash, wagerAmount))
        .to.be.revertedWithCustomError(memeMelee, "AlreadyPicked");
    });

    it("Should enforce minimum wager amount", async function() {
      const smallAmount = ethers.parseEther("0.0001"); // Less than MIN_WAGER

      await expect(memeMelee.connect(user1).pickMeme(memeHash, smallAmount))
        .to.be.revertedWithCustomError(memeMelee, "InsufficientWager");
    });

    it("Should not allow picking non-existent meme", async function() {
      const invalidMemeHash = ethers.keccak256(ethers.solidityPacked(['string'], ["Invalid"]));

      await expect(memeMelee.connect(user1).pickMeme(invalidMemeHash, wagerAmount))
        .to.be.revertedWithCustomError(memeMelee, "MemeDoesNotExist");
    });
  });

  describe("Rewards Distribution", function() {
    let memeHash: string;
    const wagerAmount = ethers.parseEther("1");

    beforeEach(async function() {
      const memeName = "Doge";
      await memeMelee.addMeme(memeName, 100);
      memeHash = ethers.keccak256(ethers.solidityPacked(['string'], [memeName]));
      await memeMelee.connect(user1).pickMeme(memeHash, wagerAmount);
    });

    it("Should calculate and distribute rewards correctly", async function() {
      await network.provider.send("evm_increaseTime", [86400]);
      await network.provider.send("evm_mine");

      await memeMelee.endRound(memeHash, 200);

      const reward = await memeMelee.userRewards(user1.address);
      expect(reward).to.equal(wagerAmount * 95n / 100n); // 95% of wager (after 5% fee)
    });

    it("Should handle multiple users correctly", async function() {
      await memeMelee.connect(user2).pickMeme(memeHash, wagerAmount);

      await network.provider.send("evm_increaseTime", [86400]);
      await network.provider.send("evm_mine");

      await memeMelee.endRound(memeHash, 200);

      const reward1 = await memeMelee.userRewards(user1.address);
      const reward2 = await memeMelee.userRewards(user2.address);

      expect(reward1).to.equal(reward2);
      expect(reward1).to.equal(wagerAmount * 95n / 100n); // Each user gets 95% of their wager back
    });

    it("Should allow users to claim rewards", async function() {
      await network.provider.send("evm_increaseTime", [86400]);
      await network.provider.send("evm_mine");

      await memeMelee.endRound(memeHash, 200);

      const expectedReward = wagerAmount * 95n / 100n;
      const initialBalance = await mockToken.balanceOf(user1.address);

      await memeMelee.connect(user1).claimReward();

      const finalBalance = await mockToken.balanceOf(user1.address);
      expect(finalBalance).to.equal(initialBalance + expectedReward);
    });

    it("Should not allow double claiming of rewards", async function() {
      await network.provider.send("evm_increaseTime", [86400]);
      await network.provider.send("evm_mine");

      await memeMelee.endRound(memeHash, 200);
      await memeMelee.connect(user1).claimReward();

      await expect(memeMelee.connect(user1).claimReward())
        .to.be.revertedWithCustomError(memeMelee, "NoRewardsToClaim");
    });
  });

  describe("Fee Management", function() {
    let memeHash: string;
    const wagerAmount = ethers.parseEther("1");

    beforeEach(async function() {
      const memeName = "Doge";
      await memeMelee.addMeme(memeName, 100);
      memeHash = ethers.keccak256(ethers.solidityPacked(['string'], [memeName]));
    });

    it("Should transfer fees to owner after round ends", async function() {
      await memeMelee.connect(user1).pickMeme(memeHash, wagerAmount);

      const initialOwnerBalance = await mockToken.balanceOf(owner.address);

      await network.provider.send("evm_increaseTime", [86400]);
      await network.provider.send("evm_mine");

      await memeMelee.endRound(memeHash, 200);

      const expectedFee = wagerAmount * 5n / 100n; // 5% fee
      const finalOwnerBalance = await mockToken.balanceOf(owner.address);
      expect(finalOwnerBalance).to.equal(initialOwnerBalance + expectedFee);
    });
  });
});
