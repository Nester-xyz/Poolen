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
  const [clickedId, setClickedId] = useState(-1);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { sessionClient } = useSessionClient();

  const handlePost = async () => {
    if (!postContent.trim()) {
      setError("Please enter content");
      return;
    }

    setIsLoading(true);
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
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getData().then((data) => setData(data));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Create Post Section - Renamed and clarified */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4">Create New Post</h2>
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm">
              {error}
            </div>
          )}
          <textarea
            className="w-full p-4 border border-gray-200 rounded-xl min-h-[120px] 
            resize-none focus:ring-2 focus:ring-purple-500 focus:border-transparent
            transition-all duration-200 ease-in-out"
            placeholder="Share your thoughts..."
            value={postContent}
            onChange={(e) => setPostContent(e.target.value)}
          />
          <div className="mt-4 flex justify-end">
            <button
              onClick={handlePost}
              disabled={!sessionClient || isLoading}
              className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 
              ${
                sessionClient && !isLoading
                  ? "bg-purple-600 text-white hover:bg-purple-700"
                  : "bg-gray-200 text-gray-500 cursor-not-allowed"
              } flex items-center gap-2`}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>
                  <span>Posting...</span>
                </>
              ) : sessionClient ? (
                "Share Post"
              ) : (
                "Please Login First"
              )}
            </button>
          </div>
        </div>

        {/* Bets List Section */}
        <div className="space-y-4">
          {data.map((card, i) => (
            <div
              key={i}
              onClick={() => setClickedId((prev) => (prev === i ? -1 : i))}
              className="transition-colors duration-200"
            >
              <Card 
                card={card} 
                isClicked={clickedId === i} 
                onExpand={() => setClickedId(i)}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BetPostCollection;
