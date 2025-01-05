const Question = ({ isClicked }: { isClicked: boolean }) => {
  return (
    <div
      className={`${isClicked ? "text-purple-700" : "text-gray-800 line-clamp-2"} text-left text-base font-medium`}
    >
      Which Meme coin will perform best in next 24 hours?
    </div>
  );
};

export default Question;
