import { useEffect, useState } from "react";
import { getData } from "../api/getData";
import { TBetCard } from "../types/list";
import Card from "../components/Card";
import { useSessionClient } from "../context/sessionContext";
import { storageClient } from "../storageClient";
import { textOnly } from "@lens-protocol/metadata";
import { post, fetchPost } from "@lens-protocol/client/actions";
import { handleWith } from "@lens-protocol/client/viem";
import { createWalletClient, custom } from "viem";
import { chains } from "@lens-network/sdk/viem";
import { evmAddress } from "@lens-protocol/client";
import { useAccount } from "wagmi";


const BetPostCollection = () => {
  const { address } = useAccount();
  const [postContent, setPostContent] = useState("");
  const [data, setData] = useState<TBetCard[]>([]);
  const [clickedId, setClickedId] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const { sessionClient } = useSessionClient();

  useEffect(() => {
    console.log("Current session client:", sessionClient);
  }, [sessionClient]);

  const handlePost = async () => {
    if (!postContent.trim()) {
      setError("Please enter content");
      return;
    }

    try {
      if (!sessionClient || !address) {
        throw new Error("Please login first");
      }

      const walletClient = createWalletClient({
        account: evmAddress(address),
        chain: chains.testnet,
        transport: custom(window.ethereum),
      });

      const metadata = textOnly({
        content: postContent,
      });

      const { uri } = await storageClient.uploadAsJson(metadata);
      console.log("Content uploaded to IPFS:", uri);

      const result = await post(sessionClient, { contentUri: uri })
        .andThen(handleWith(walletClient))
        .andThen(sessionClient.waitForTransaction)
        .andThen((txHash) => fetchPost(sessionClient, { txHash }));

      if (result.isOk()) {
        console.log("Post details:", result.value);
        setPostContent("");
        setError(null);
      } else {
        console.error("Failed to fetch post details:", result.error);
        setError("Failed to create post");
      }
    } catch (error) {
      console.error("Error creating post:", error);
      setError(error instanceof Error ? error.message : "Failed to create post");
    }
  };

  useEffect(() => {
    getData().then((data) => setData(data));
  }, []);

  return (
    <div className="px-2">
      <div className="w-full max-w-md">
        {error && (
          <div className="text-red-500 mb-2 text-sm">{error}</div>
        )}
        <textarea
          className="w-full p-3 border rounded-md min-h-[120px] resize-none"
          placeholder="What's on your mind?"
          value={postContent}
          onChange={(e) => setPostContent(e.target.value)}
        />
        <button
          onClick={handlePost}
          disabled={!sessionClient}
          className={`mt-2 w-full p-2 rounded-md transition-colors ${
            sessionClient
              ? "bg-blue-500 text-white hover:bg-blue-600"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          {sessionClient ? "Post" : "Please Login First"}
        </button>
      </div>
      <div className="relative flex flex-col gap-2">
        {data.map((card, i) => {
          return (
            <button
              onClick={() => setClickedId((prev) => (prev === i ? -1 : i))}
            >
              <Card card={card} key={i} isClicked={clickedId === i} />
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default BetPostCollection;
