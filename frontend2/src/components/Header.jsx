import SearchIcon from "@mui/icons-material/Search";
import MenuIcon from "@mui/icons-material/Menu";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";

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

        {/* Header text */}
        <div className="text-xl font-bold text-blue-900">
          Admin<span className="text-indigo-800">Panel</span>
        </div>

        {/* Header menu */}
        <div className="flex items-center space-x-2">
          <Link>
            <SearchIcon fontSize="medium" />
          </Link>
          <Link>
            <NotificationsNoneIcon fontSize="medium" />
          </Link>

          <img
            className="w-10 h-10 rounded-full"
            src="https://i.pinimg.com/564x/de/0f/3d/de0f3d06d2c6dbf29a888cf78e4c0323.jpg"
            alt="Profile"
          />
        </div>
      </div>
    </header>
  );
}

export function AuthHeader({ className }) {
  return (
    <header className={`${className} w-full bg-white text-indigo-800 z-50`}>
      <div className="max-w-6xl mx-auto px-4 py-2 flex items-center justify-between h-16">
        {/* Header text */}
        <div className="text-xl font-bold text-blue-900">
          Admin<span className="text-indigo-800">Panel</span>
        </div>
      </div>
    </header>
  );
}
