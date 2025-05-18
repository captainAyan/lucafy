import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import PostAddOutlinedIcon from "@mui/icons-material/PostAddOutlined";
import FolderOutlinedIcon from "@mui/icons-material/FolderOutlined";
import FaceOutlinedIcon from "@mui/icons-material/FaceOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import PowerSettingsNewOutlinedIcon from "@mui/icons-material/PowerSettingsNewOutlined";
import KeyboardArrowRightOutlinedIcon from "@mui/icons-material/KeyboardArrowRightOutlined";
import { Link, NavLink } from "react-router-dom";

function SidebarButton({ children, icon, title, to }) {
  return (
    <Link to={to}>
      <span className="flex items-center text-gray-600 px-2 py-3 my-1 hover:bg-indigo-100 rounded-lg cursor-pointer transition-all duration-300">
        <span className="mr-2">{icon}</span>
        {title}
        <span className="ml-auto">
          <KeyboardArrowRightOutlinedIcon />
        </span>
        {children}
      </span>
    </Link>
  );
}

export default function Sidebar({ className }) {
  return (
    <aside
      className={`${className} fixed lg:static w-[320px] bg-indigo-50 h-[calc(100vh-4rem)] lg:h-auto transform -translate-x-full lg:translate-x-0 transition-transform duration-300 z-45 overflow-y-auto p-4`}
    >
      <div className="bg-white rounded-xl mb-6 p-4 transition-all duration-300">
        <SidebarButton
          to={"/dashboard"}
          icon={<DashboardOutlinedIcon />}
          title="Dashboard"
        />
        <SidebarButton
          to={"/journal"}
          icon={<PostAddOutlinedIcon />}
          title="Journal"
        />
        <SidebarButton
          to={"/ledgers"}
          icon={<FolderOutlinedIcon />}
          title="Ledgers"
        />
      </div>
      <div className="bg-white rounded-xl p-4 transition-all duration-300">
        <SidebarButton href="#" icon={<FaceOutlinedIcon />} title="Profile" />
        <SidebarButton
          href="#"
          icon={<SettingsOutlinedIcon />}
          title="Settings"
        />
        <SidebarButton
          href="#"
          icon={<PowerSettingsNewOutlinedIcon />}
          title="Logout"
        />
      </div>

      <div className="px-2 py-4 text-xs">
        <NavLink to="/about" className="text-gray-500 hover:underline">
          About Us
        </NavLink>
        <span className="mx-2">&middot;</span>
        <NavLink to="/about#privacy" className="text-gray-500 hover:underline">
          Privacy Policy
        </NavLink>
        <span className="mx-2">&middot;</span>
        <NavLink to="/about#tnc" className="text-gray-500 hover:underline">
          Terms & Conditions
        </NavLink>
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
