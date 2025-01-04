import AdminPanel from "./components/AdminPanel";
import UserPanel from "./components/UserPanel";
import Bets from "./pages/bets";
import Connect from "./pages/Connect";
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <div className="max-w-[30rem] mx-auto border border-black h-screen">
      <div>
        {/* <Connect /> */}
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Connect />} />
            <Route path="/bet" element={<Bets />} />
            <Route path='/admin' element={<AdminPanel />} />
            <Route path='/user' element={<UserPanel />} />
          </Routes>
        </BrowserRouter>
      </div>
    </div>
  );
}

export default App;
