const Question = ({ isClicked }: { isClicked: boolean }) => {
  return (
    <div
      className={`${isClicked ? "text-purple-700" : "text-gray-800 line-clamp-2"} text-left text-base font-medium`}
    >
      Lorem ipsum dolor sit amet, consectetur adipisicing elit. Deserunt numquam
      veniam, nesciunt non dolor, sint, ratione illum corrupti corporis voluptas
      nihil autem.
    </div>
  );
};

export default Question;
