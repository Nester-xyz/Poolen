import Connect from "./components/Connect";
import BetPostCollection from "./components/betPostCollection";
import Title from "./components/Title";
import Profile from "./components/Profile";

function App() {
  return (
    <div className="max-w-[30rem] mx-auto border border-black h-screen pt-10">
      <div className="flex flex-col gap-10">
        <Profile />
        <Connect />
        <Title />
        <BetPostCollection />
      </div>
    </div>
  );
}

export default App;
