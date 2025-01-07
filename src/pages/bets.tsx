import { useEffect, useState } from "react";
import { getData } from "../api/getData";
import { TBetCard } from "../types/list";
import Card from "../components/Card";
// import { useSessionClient } from "../context/sessionContext";
// import { storageClient } from "../storageClient";
// import { textOnly } from "@lens-protocol/metadata";
// import { post, fetchPost } from "@lens-protocol/client/actions";
// import { handleWith } from "@lens-protocol/client/viem";
// import { createWalletClient, custom } from "viem";
// import { chains } from "@lens-network/sdk/viem";
// import { evmAddress } from "@lens-protocol/client";
// import { useAccount } from "wagmi";

const BetPostCollection = () => {
  // const { address } = useAccount();
  // const [postContent, setPostContent] = useState("");
  const [card, setCard] = useState<TBetCard | null>(null);
  // const [error, setError] = useState<string | null>(null);
  // const [isLoading, setIsLoading] = useState(false);
  // const { sessionClient } = useSessionClient();
  const [betAmount, setBetAmount] = useState("");
  const [isClicked, setIsClicked] = useState(false);

  // const handlePost = async () => {
  //   if (!postContent.trim()) {
  //     setError("Please enter content");
  //     return;
  //   }

  //   setIsLoading(true);
  //   try {
  //     if (!sessionClient || !address) {
  //       throw new Error("Please login first");
  //     }

  //     const walletClient = createWalletClient({
  //       account: evmAddress(address),
  //       chain: chains.testnet,
  //       transport: custom(window.ethereum),
  //     });

  //     const metadata = textOnly({
  //       content: postContent,
  //     });

  //     const { uri } = await storageClient.uploadAsJson(metadata);
  //     console.log("Content uploaded to IPFS:", uri);

  //     const result = await post(sessionClient, { contentUri: uri })
  //       .andThen(handleWith(walletClient))
  //       .andThen(sessionClient.waitForTransaction)
  //       .andThen((txHash) => fetchPost(sessionClient, { txHash }));

  //     if (result.isOk()) {
  //       console.log("Post details:", result.value);
  //       setPostContent("");
  //       setError(null);
  //     } else {
  //       console.error("Failed to fetch post details:", result.error);
  //       setError("Failed to create post");
  //     }
  //   } catch (error) {
  //     console.error("Error creating post:", error);
  //     setError(error instanceof Error ? error.message : "Failed to create post");
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  useEffect(() => {
    getData().then((data) => setCard(data[0]));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Single Card Section */}
        {card && (
          <div className="transition-colors duration-200">
            <Card 
              card={card} 
              betAmount={betAmount}
              setBetAmount={setBetAmount}
              isClicked={isClicked}
              onExpand={() => setIsClicked(!isClicked)}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default BetPostCollection;
