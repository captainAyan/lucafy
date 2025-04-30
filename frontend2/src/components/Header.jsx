import { useSelector } from "react-redux";
import SearchIcon from "@mui/icons-material/Search";
import MenuIcon from "@mui/icons-material/Menu";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";

import Avatar from "./Avatar";

function Link({ children }) {
  return (
    <span className="text-2xl cursor-pointer w-10 h-10 px-2 hover:bg-indigo-100 rounded-md text-indigo-800 transition-all duration-300">
      {children}
    </span>
  );
}

/**
 * This header is for the authenticated layout
 */
export function MainHeader({ toggleMenu, className }) {
  const { user } = useSelector((state) => state.auth);

  return (
    <header
      className={`${className} fixed w-full bg-white text-indigo-800 z-50`}
    >
      <div className="max-w-6xl mx-auto px-4 py-2 flex items-center justify-between h-16">
        {/* Menu icon */}
        <span
          onClick={toggleMenu}
          className="text-2xl cursor-pointer w-10 h-10 px-2 lg:hidden hover:bg-indigo-100 rounded-md text-indigo-800 transition-all duration-300"
        >
          <MenuIcon fontSize="medium" />
        </span>

        <img src="/logo-light.png" alt="Logo" className="h-8" />

        {/* Header menu */}
        <div className="flex items-center space-x-2">
          <Link>
            <SearchIcon fontSize="medium" />
          </Link>
          <Link>
            <NotificationsNoneIcon fontSize="medium" />
          </Link>

          <div className="w-10 rounded-full border-2 border-gray-300 hover:cursor-pointer hover:border-gray-600 duration-300">
            {user ? (
              <Avatar
                width={20}
                cell={5}
                color={"#4da3ff"}
                seed={user?.id}
                className="rounded-full"
              />
            ) : null}
          </div>
        </div>
      </div>
    </header>
  );
}

export function AuthHeader({ className }) {
  return (
    <header className={`${className} w-full bg-white text-indigo-800 z-50`}>
      <div className="max-w-6xl mx-auto px-4 py-2 flex items-center justify-between h-16">
        <img src="/logo-light.png" alt="Logo" className="h-8" />
      </div>
    </header>
  );
}
