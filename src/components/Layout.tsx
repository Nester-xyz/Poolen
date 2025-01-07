import { Outlet, Link, useLocation } from "react-router-dom";
import { SiBitcoinsv } from "react-icons/si";
import { FaCircleUser } from "react-icons/fa6";
import { useState, useEffect } from "react";

const Layout = () => {
  const [activeTab, setActiveTab] = useState<'bets' | 'profile'>('bets');
  const location = useLocation();

  // Update activeTab based on current route
  useEffect(() => {
    if (location.pathname === '/protected') {
      setActiveTab('bets');
    } else if (location.pathname === '/protected/profile') {
      setActiveTab('profile');
    }
  }, [location.pathname]);

  return (
    <div className="h-full flex flex-col bg-gray-100">
      {/* Main content area with scrolling */}
      <div className="flex-1 overflow-y-auto pb-20">
        <Outlet />
      </div>

      {/* Fixed footer navigation */}
      <footer className="fixed bottom-0 left-0 right-0 max-w-[30rem] mx-auto bg-white shadow-md border-t border-gray-300">
        <nav className="flex justify-around items-center py-3 text-xl">
          {/* Navigation links */}
          <Link
            to="/protected"
            onClick={() => setActiveTab('bets')}
            className={`flex flex-col items-center transition duration-200 ${
              activeTab === 'bets' 
                ? 'text-blue-600 scale-110' 
                : 'text-gray-700 hover:text-blue-600'
            }`}
          >
            <SiBitcoinsv className="text-3xl mb-1" />
            <span className="text-xs">Bets</span>
          </Link>
          <Link
            to="/protected/profile"
            onClick={() => setActiveTab('profile')}
            className={`flex flex-col items-center transition duration-200 ${
              activeTab === 'profile' 
                ? 'text-blue-600 scale-110' 
                : 'text-gray-700 hover:text-blue-600'
            }`}
          >
            <FaCircleUser className="text-3xl mb-1" />
            <span className="text-xs">Profile</span>
          </Link>
        </nav>
      </footer>
    </div>
  );
};

export default Layout;
