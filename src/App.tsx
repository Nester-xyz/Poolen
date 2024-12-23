import BetPost from "./components/betPost";
import Title from "./components/Title";

function App() {
  return (
    <div className="max-w-[30rem] mx-auto border border-black h-screen">
      <div>
        <Title />
        <BetPost />
      </div>
    </div>
  );
}

export default App;
