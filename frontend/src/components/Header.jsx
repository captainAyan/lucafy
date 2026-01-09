import { useSelector } from "react-redux";
import MenuIcon from "@mui/icons-material/Menu";
import AddIcon from "@mui/icons-material/Add";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import { NavLink } from "react-router-dom";

import Avatar from "./Avatar";

function NavLinkButton({ children, className = "", ...attr }) {
  return (
    <button
      className={`inline-flex items-center cursor-pointer w-10 h-10 px-2 hover:bg-indigo-100 rounded-md text-gray-800 border-0 focus:outline-none focus:ring-4 ring-indigo-200 duration-300 ${className}`}
      {...attr}
    >
      {children}
    </button>
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
        <NavLinkButton onClick={toggleMenu} className="lg:hidden">
          <MenuIcon fontSize="medium" />
        </NavLinkButton>

        <img src="/logo-light.png" alt="Logo" className="h-8" />

        {/* Header menu */}
        <div className="flex items-center space-x-4">
          <NavLink to="/create">
            <NavLinkButton>
              <AddIcon fontSize="medium" />
            </NavLinkButton>
          </NavLink>
          <NavLinkButton>
            <NotificationsNoneIcon fontSize="medium" />
          </NavLinkButton>

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
