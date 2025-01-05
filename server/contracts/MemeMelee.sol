// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";

contract MemeMelee is Ownable {
    using ECDSA for bytes32;

    struct Meme {
        bool exists; // New field to track existence
        string name;
        uint256 totalWagered;
        uint256 pickCount;
        uint256 openPrice;
        uint256 closePrice;
        mapping(address => uint256) userWagers;
        address[] userList;
    }

    IERC20 public immutable grassToken; // Made immutable for gas optimization
    uint256 public constant ROUND_DURATION = 1 days;
    uint256 public constant MIN_WAGER = 1e15; // 0.001 GRASS
    uint256 public constant FEE_PERCENT = 5; // Made constant
    uint256 public roundEndTime;
    uint256 public prizePool;

    mapping(bytes32 => Meme) private memes;
    mapping(address => bool) private hasPicked;
    mapping(address => uint256) public userRewards;
    bytes32[] private memeHashes;

    uint256 public currentRound;
    bool public roundActive;

    event MemePicked(
        address indexed user,
        bytes32 indexed memeHash,
        uint256 amount
    );
    event RoundEnded(bytes32 indexed winningMeme, uint256 prizeDistributed);
    event UserRewarded(address indexed user, uint256 amount);
    event MemePriceSet(
        bytes32 indexed memeHash,
        uint256 openPrice,
        uint256 closePrice
    );
    event NewRoundStarted(
        uint256 indexed roundNumber,
        uint256 startTime,
        uint256 endTime
    );
    event MemeAdded(bytes32 indexed memeHash, string name, uint256 openPrice);

    error MemeAlreadyExists();
    error MemeDoesNotExist();
    error RoundNotActive();
    error RoundStillActive();
    error RoundHasEnded();
    error AlreadyPicked();
    error InsufficientWager();
    error InvalidClosePrice();
    error NoRewardsToClaim();
    error TransferFailed();

    constructor(address _grassToken) Ownable(msg.sender) {
        require(_grassToken != address(0), "Invalid token address");
        grassToken = IERC20(_grassToken);
        _startNewRound();
    }

    function _startNewRound() internal {
        if (roundActive && block.timestamp < roundEndTime) {
            revert RoundStillActive();
        }

        roundEndTime = block.timestamp + ROUND_DURATION;
        currentRound++;
        roundActive = true;
        prizePool = 0;

        // Reset meme stats and user picks
        for (uint256 i = 0; i < memeHashes.length; i++) {
            bytes32 memeHash = memeHashes[i];
            Meme storage meme = memes[memeHash];

            // Reset meme stats
            meme.totalWagered = 0;
            meme.pickCount = 0;
            meme.closePrice = 0;

            // Clear user wagers
            uint256 userCount = meme.userList.length;
            for (uint256 j = 0; j < userCount; j++) {
                address user = meme.userList[j];
                meme.userWagers[user] = 0;
                hasPicked[user] = false;
            }
            delete meme.userList;
        }

        emit NewRoundStarted(currentRound, block.timestamp, roundEndTime);
    }

    modifier onlyDuringRound() {
        if (!roundActive) {
            revert RoundNotActive();
        }
        if (block.timestamp >= roundEndTime) {
            revert RoundHasEnded();
        }
        _;
    }

    function pickMeme(
    bytes32 memeHash
    ) external payable onlyDuringRound {
        if (hasPicked[msg.sender]) {
            revert AlreadyPicked();
        }
        if (msg.value < MIN_WAGER) {  // Check the actual sent ETH value
            revert InsufficientWager();
        }

        Meme storage meme = memes[memeHash];
        if (!meme.exists) {
            revert MemeDoesNotExist();
        }

        // Update meme and user data
        meme.totalWagered += msg.value;  // Use msg.value instead of amount parameter
        meme.pickCount++;
        if (meme.userWagers[msg.sender] == 0) {
            meme.userList.push(msg.sender);
        }
        meme.userWagers[msg.sender] += msg.value;
        prizePool += msg.value;
        hasPicked[msg.sender] = true;

        emit MemePicked(msg.sender, memeHash, msg.value);
    }

    function endRound(
        bytes32 winningMeme,
        uint256 closePrice
    ) external onlyOwner {
        if (!roundActive) {
            revert RoundNotActive();
        }
        if (block.timestamp < roundEndTime) {
            revert RoundStillActive();
        }
        if (closePrice == 0) {
            revert InvalidClosePrice();
        }

        Meme storage winner = memes[winningMeme];
        if (!winner.exists || winner.pickCount == 0) {
            revert MemeDoesNotExist();
        }

        // Set close price
        winner.closePrice = closePrice;
        emit MemePriceSet(winningMeme, winner.openPrice, closePrice);

        uint256 fee = (prizePool * FEE_PERCENT) / 100;
        uint256 rewardPool = prizePool - fee;

        // Distribute rewards and send directly
        for (uint256 i = 0; i < winner.userList.length; i++) {
            address user = winner.userList[i];
            uint256 userWager = winner.userWagers[user];
            if (userWager > 0) {
                uint256 userReward = (userWager * rewardPool) / winner.totalWagered;

                // Send reward directly
                (bool success, ) = user.call{value: userReward}("");
                if (!success) {
                    revert TransferFailed();
                }

                emit UserRewarded(user, userReward);
            }
        }

        // Transfer fee to owner
        if (fee > 0) {
            (bool success, ) = owner().call{value: fee}("");
            if (!success) {
                revert TransferFailed();
            }
        }

        roundActive = false;
        emit RoundEnded(winningMeme, rewardPool);

        // Start new round
        _startNewRound();
    }


    function addMeme(
        string calldata name,
        uint256 openPrice
    ) external onlyOwner {
        bytes32 memeHash = keccak256(abi.encodePacked(name));
        if (memes[memeHash].exists) {
            revert MemeAlreadyExists();
        }

        Meme storage newMeme = memes[memeHash];
        newMeme.exists = true;
        newMeme.name = name;
        newMeme.openPrice = openPrice;
        memeHashes.push(memeHash);

        emit MemeAdded(memeHash, name, openPrice);
        emit MemePriceSet(memeHash, openPrice, 0);
    }


    function getMemeDetails(
        bytes32 memeHash
    )
        external
        view
        returns (
            string memory name,
            uint256 totalWagered,
            uint256 pickCount,
            uint256 openPrice,
            uint256 closePrice,
            bool exists
        )
    {
        Meme storage meme = memes[memeHash];
        return (
            meme.name,
            meme.totalWagered,
            meme.pickCount,
            meme.openPrice,
            meme.closePrice,
            meme.exists
        );
    }

    function getMemeHashes() external view returns (bytes32[] memory) {
        return memeHashes;
    }

    function getRoundEndTime() external view returns (uint256) {
        return roundEndTime;
    }
}
