import Layout from "./components/Layout";
import Profile from "./components/Profile";
import AdminPanel from "./components/AdminPanel";
import UserPanel from "./components/UserPanel";
import Bets from "./pages/bets";
import Connect from "./pages/Connect";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SessionProvider } from './context/sessionContext';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <SessionProvider>
      <div className="max-w-[30rem] mx-auto shadow-lg border border-gray-200 h-screen">
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Connect />} />
            <Route path="/protected" element={<ProtectedRoute />}>
              <Route element={<Layout />}>
                <Route index element={<Bets />} />
                <Route path="profile" element={<Profile />} />
              </Route>
            </Route>
            <Route path="/bet" element={<Bets />} />
            <Route path='/admin' element={<AdminPanel />} />
            <Route path='/user' element={<UserPanel />} />
          </Routes>
        </BrowserRouter>
      </div>
    </SessionProvider>
  );
}

export default App;
