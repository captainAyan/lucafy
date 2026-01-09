import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import FaceOutlinedIcon from "@mui/icons-material/FaceOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import PowerSettingsNewOutlinedIcon from "@mui/icons-material/PowerSettingsNewOutlined";
import KeyboardArrowRightOutlinedIcon from "@mui/icons-material/KeyboardArrowRightOutlined";
import BalanceOutlinedIcon from "@mui/icons-material/BalanceOutlined";
import LibraryBooksOutlinedIcon from "@mui/icons-material/LibraryBooksOutlined";
import ReceiptLongOutlinedIcon from "@mui/icons-material/ReceiptLongOutlined";
import { Link, NavLink } from "react-router-dom";

function SidebarButton({ children, icon, title, to }) {
  return (
    <NavLink to={to}>
      {({ isActive }) => (
        <span
          className={`flex items-center ${
            isActive ? "bg-indigo-100" : ""
          } text-gray-600 px-2 py-3 my-1 hover:bg-indigo-100 rounded-lg cursor-pointer transition-all duration-300`}
        >
          <span className="mr-2">{icon}</span>
          {title}
          <span className="ml-auto">
            <KeyboardArrowRightOutlinedIcon />
          </span>
          {children}
        </span>
      )}
    </NavLink>
  );
}

export default function Sidebar({ className }) {
  return (
    <aside
      className={`${className} fixed lg:static w-[320px] h-[calc(100vh-4rem)] lg:h-auto transform -translate-x-full lg:translate-x-0 transition-transform duration-300 z-45 overflow-y-auto p-4`}
    >
      <div className="bg-white rounded-xl mb-6 p-4 transition-all duration-300">
        <SidebarButton
          to={"/dashboard"}
          icon={<DashboardOutlinedIcon />}
          title="Dashboard"
        />
        <SidebarButton
          to={"/journal"}
          icon={<ReceiptLongOutlinedIcon />}
          title="Journal"
        />
        <SidebarButton
          to={"/ledgers"}
          icon={<LibraryBooksOutlinedIcon />}
          title="Ledgers"
        />
        <SidebarButton
          to={"/trial-balance"}
          icon={<BalanceOutlinedIcon />}
          title="Trial Balance"
        />
      </div>
      <div className="bg-white rounded-xl p-4 transition-all duration-300">
        <SidebarButton
          to={"/profile"}
          icon={<FaceOutlinedIcon />}
          title="Profile"
        />
        <SidebarButton
          to={"/settings"}
          icon={<SettingsOutlinedIcon />}
          title="Settings"
        />
        <SidebarButton
          to={"/logout"}
          icon={<PowerSettingsNewOutlinedIcon />}
          title="Logout"
        />
      </div>

      <div className="px-2 py-4 text-xs">
        <Link to="/about" className="text-gray-500 hover:underline">
          About Us
        </Link>
        <span className="mx-2">&middot;</span>
        <Link to="/about#privacy" className="text-gray-500 hover:underline">
          Privacy Policy
        </Link>
        <span className="mx-2">&middot;</span>
        <Link to="/about#tnc" className="text-gray-500 hover:underline">
          Terms & Conditions
        </Link>
        <span className="mx-2">&middot;</span>
        <a
          href="https://github.com/captainAyan/lucafy/issues"
          target="_blank"
          className="text-gray-500 hover:underline"
        >
          Report Issue
        </a>
      </div>
    </aside>
  );
}
