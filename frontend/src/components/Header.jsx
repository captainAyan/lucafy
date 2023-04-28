import { useState } from "react";
import { Link } from "react-router-dom";
import { useStore, useDispatch, useSelector } from "react-redux";
import { setTheme } from "../features/preference/preferenceSlice";
import { logout } from "../features/auth/authSlice";
import { DARK, LIGHT } from "../constants/theme";
import Avatar from "./Avatar";

export default function Header() {
  const dispatch = useDispatch();
  const store = useStore();

  const [checked, setChecked] = useState(
    store.getState().preference.theme === DARK
  );

  const { user } = useSelector((state) => state.auth);
  const { theme } = useSelector((state) => state.preference);

  const handleChange = (event) => {
    dispatch(setTheme(event.target.checked ? DARK : LIGHT));
    setChecked(event.target.checked);
  };

  return (
    <div className="navbar bg-base-100">
      <div className="flex-1 navbar-start">
        <Link to="/" className="btn btn-ghost normal-case text-xl">
          <img
            alt="logo"
            src={theme === DARK ? "/logo-dark.png" : "/logo-light.png"}
            className="h-10"
          />
        </Link>
      </div>

      <div className="flex-none navbar-end">
        {user ? (
          <>
            <Link to="export">
              <button className="btn btn-ghost btn-circle">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"
                  />
                </svg>
              </button>
            </Link>

            <div className="dropdown dropdown-end ">
              <label
                tabIndex="0"
                className="btn btn-ghost btn-circle swap swap-rotate"
              >
                <button>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
                    />
                  </svg>
                </button>
              </label>
              <ul
                tabIndex="0"
                className="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52"
              >
                <li>
                  <Link to="journal">Journal</Link>
                </li>
                <li>
                  <Link to="ledgers">Ledger</Link>
                </li>
                <li>
                  <Link to="trial-balance">Trial Balance</Link>
                </li>
                <li>
                  <Link to="search-entry">Search Entry</Link>
                </li>
              </ul>
            </div>

            <div className="dropdown dropdown-end ">
              <label
                tabIndex="0"
                className="btn btn-ghost btn-circle swap swap-rotate"
              >
                <button>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 4.5v15m7.5-7.5h-15"
                    />
                  </svg>
                </button>
              </label>
              <ul
                tabIndex="0"
                className="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52"
              >
                <li>
                  <Link to="ledger">Ledger</Link>
                </li>
                <li>
                  <Link to="entry">Entry</Link>
                </li>
              </ul>
            </div>
          </>
        ) : null}

        <div className="dropdown dropdown-end ">
          <label
            tabIndex="0"
            className="btn btn-ghost btn-circle swap swap-rotate mr-2"
          >
            <input type="checkbox" checked={checked} onChange={handleChange} />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="swap-on h-6 w-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"
              />
            </svg>

            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="swap-off w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z"
              />
            </svg>
          </label>
        </div>

        {user ? (
          <div className="dropdown dropdown-end">
            <label
              tabIndex="0"
              className="btn btn-ghost btn-circle btn-outline avatar"
            >
              <div className="w-10 rounded-full">
                <Avatar width={20} cell={5} color={"#4da3ff"} seed={user.id} />
              </div>
            </label>
            <ul
              tabIndex="0"
              className="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52"
            >
              <li>
                <Link to="profile">Profile</Link>
              </li>
              <li>
                <Link to="settings">Settings</Link>
              </li>
              <li>
                <span
                  onClick={() => {
                    localStorage.setItem("token", "");
                    dispatch(logout());
                  }}
                >
                  Logout
                </span>
              </li>
            </ul>
          </div>
        ) : null}
      </div>
    </div>
  );
}
