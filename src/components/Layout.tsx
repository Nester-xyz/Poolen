import { Outlet, Link } from "react-router-dom";
import { SiBitcoinsv } from "react-icons/si";
import { FaCircleUser } from "react-icons/fa6";

const Layout = () => {
  return (
    <div className="h-full flex flex-col bg-gray-100">
      {/* Main content area */}
      <div className="flex-grow p-4">
        <Outlet />
      </div>

      {/* Footer navigation */}
      <footer className="bg-white shadow-md border-t border-gray-300">
        <nav className="flex justify-around items-center py-3 text-xl">
          {/* Navigation links */}
          <Link
            to="/protected"
            className="flex flex-col items-center text-gray-700 hover:text-blue-600 transition duration-200"
          >
            <SiBitcoinsv className="text-3xl mb-1" />
          </Link>
          <Link
            to="/protected/profile"
            className="flex flex-col items-center text-gray-700 hover:text-blue-600 transition duration-200"
          >
            <FaCircleUser className="text-3xl mb-1" />
          </Link>
        </nav>
      </footer>
    </div>
  );
};

export default Layout;
