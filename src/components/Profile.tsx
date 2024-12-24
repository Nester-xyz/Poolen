const Profile = () => {
  const avatar = "https://placehold.co/600x400";
  const userName = "Alex";
  const description = "I am a developer";
  const followersCount = 100;
  const followsCount = 100;
  const postsCount = 100;

  return (
    <div className="relative">
      <div className="bg-blue-700 w-full h-32 relative">
        <div className="flex items-center">
          <div className="flex w-24 bg-slate-200 aspect-square rounded-full absolute left-4 -bottom-12 shadow-lg">
            <img
              src={avatar}
              alt=""
              className="rounded-full w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
      {/* Profile Name */}
      <div className="flex flex-col gap-3 mt-[64px]">
        <div className="flex flex-col">
          <div className="text-2xl display-font ml-2">{userName}</div>
          <div className="flex ml-2 gap-2">
            <div className="text-sm text-slate-500">@{userName}</div>
          </div>
        </div>
        <div>
          {/* <div className="text-sm">Bio</div> */}
          <div className="text-sm ml-2">{description}</div>
        </div>
      </div>
      {/* followers, following and posts */}
      <div className="flex gap-8 pt-2 ml-2">
        <div className="flex gap-1 items-center">
          <div className="text-[15px]">{followersCount?.toString()} </div>
          <span className="text-slate-500 text-[13px]">followers</span>
        </div>
        <div className="flex gap-1 items-center">
          <div className="text-[15px]">{followsCount?.toString()} </div>
          <span className="text-slate-500 text-[13px]">following</span>
        </div>
        <div className="flex gap-1 items-center">
          <div className="text-[15px]">{postsCount?.toString()} </div>
          <span className="text-slate-500 text-[13px]">posts</span>
        </div>
      </div>
    </div>
  );
};

export default Profile;
