import { useEffect, useState } from "react";
import { getData } from "../api/getData";
import { TBetCard } from "../types/list";
import Card from "../components/Card";

const BetPostCollection = () => {
  const [postContent, setPostContent] = useState("");
  const [data, setData] = useState<TBetCard[]>([]);
  const [clickedId, setClickedId] = useState(0);

  const handlePost = async () => {
    console.log(postContent);
    // try {
    //   if (!state.sessionClient) {
    //     throw new Error("Not authenticated");
    //   }

    //   const metadata = textOnly({
    //     content: postContent,
    //   });

    //   const { uri } = await storageClient.uploadAsJson(metadata);
    //   console.log(uri);
    //   // todo: post request the content to the lens
    // } catch (error) {
    //   console.error("Error creating post:", error);
    //   setError(
    //     error instanceof Error ? error.message : "Failed to create post",
    //   );
    // }
  };

  useEffect(() => {
    getData().then((data) => setData(data));
  }, []);

  return (
    <div className="px-2 ">
      <div className="w-full max-w-md">
        <textarea
          className="w-full p-3 border rounded-md min-h-[120px] resize-none"
          placeholder="What's on your mind?"
          onChange={(e) => setPostContent(e.target.value)}
        />
        <button
          onClick={handlePost}
          className="mt-2 w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition-colors"
        >
          Post
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
