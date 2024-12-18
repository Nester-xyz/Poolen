const BetPost = () => {
  return (
    <div className="px-2 ">
      {/* Triangle */}
      <div className="relative">
        {/* <div className="absolute top-0 right-0 w-0 h-0 border-t-[20px] border-t-red-500 border-r-[20px] border-r-red-500 border-b-[20px] border-b-transparent"></div> */}
        {/* Main content */}
        <div className="w-full h-40 border border-black rounded-tl-xl">
          <div className="border triangle absolute bg-red-200"></div>
        </div>
      </div>
    </div>
  );
};

export default BetPost;
