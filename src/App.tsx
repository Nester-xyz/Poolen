import Layout from "./components/Layout";
import Profile from "./components/Profile";
import Bets from "./pages/bets";
import Connect from "./pages/Connect";
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <div className="max-w-[30rem] mx-auto border border-black h-screen">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Connect />} />
          <Route path="/protected" element={<Layout />}>
            <Route index element={<Bets />} />
            <Route path="profile" element={<Profile />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
