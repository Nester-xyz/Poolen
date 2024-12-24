import Connect from "./components/Connect";
import BetPostCollection from "./components/betPostCollection";
import Title from "./components/Title";

function App() {
  return (
    <div className="max-w-[30rem] mx-auto border border-black h-screen pt-10">
      <div className="flex flex-col gap-10">
        <Connect />
        <Title />
        <BetPostCollection />
      </div>
    </div>
  );
}

export default App;
