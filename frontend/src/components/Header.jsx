import { useState } from "react";
import { Link } from "react-router-dom";
import { useStore, useDispatch } from "react-redux";
import { toDarkMode } from "../features/theme/themeSlice";

export default function Header() {
  const dispatch = useDispatch();
  const store = useStore();

  const [checked, setChecked] = useState(
    store.getState().theme.mode === "dark"
  );

  const handleChange = (event) => {
    dispatch(toDarkMode(event.target.checked));
    setChecked(event.target.checked);
  };

  return (
    <div className="navbar bg-base-100">
      <div className="flex-1 navbar-start">
        <Link to="/" className="btn btn-ghost normal-case text-xl">
          Accounting Web
        </Link>
      </div>

      <div className="flex-none navbar-end">
        <div className="dropdown dropdown-end ">
          <label
            tabIndex="0"
            className="btn btn-ghost btn-circle swap swap-rotate"
          >
            <button>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeLinecap="round"
              >
                <path
                  strokeWidth="3"
                  d="m 6 8 L 10 8 L 10 4 L 18 4 L 18 20 L 6 20 L 6 8 L 10 4"
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
              <Link to="trial-balance">Trial Balance</Link>
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
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeLinecap="round"
              >
                <path strokeWidth="3" d="m 4 12 L 20 12 M 12 4 L 12 20" />
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

        <div className="dropdown dropdown-end ">
          <label
            tabIndex="0"
            className="btn btn-ghost btn-circle swap swap-rotate mr-2"
          >
            <input type="checkbox" checked={checked} onChange={handleChange} />

            <svg
              className="swap-on fill-current h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
            >
              <path d="M5.64,17l-.71.71a1,1,0,0,0,0,1.41,1,1,0,0,0,1.41,0l.71-.71A1,1,0,0,0,5.64,17ZM5,12a1,1,0,0,0-1-1H3a1,1,0,0,0,0,2H4A1,1,0,0,0,5,12Zm7-7a1,1,0,0,0,1-1V3a1,1,0,0,0-2,0V4A1,1,0,0,0,12,5ZM5.64,7.05a1,1,0,0,0,.7.29,1,1,0,0,0,.71-.29,1,1,0,0,0,0-1.41l-.71-.71A1,1,0,0,0,4.93,6.34Zm12,.29a1,1,0,0,0,.7-.29l.71-.71a1,1,0,1,0-1.41-1.41L17,5.64a1,1,0,0,0,0,1.41A1,1,0,0,0,17.66,7.34ZM21,11H20a1,1,0,0,0,0,2h1a1,1,0,0,0,0-2Zm-9,8a1,1,0,0,0-1,1v1a1,1,0,0,0,2,0V20A1,1,0,0,0,12,19ZM18.36,17A1,1,0,0,0,17,18.36l.71.71a1,1,0,0,0,1.41,0,1,1,0,0,0,0-1.41ZM12,6.5A5.5,5.5,0,1,0,17.5,12,5.51,5.51,0,0,0,12,6.5Zm0,9A3.5,3.5,0,1,1,15.5,12,3.5,3.5,0,0,1,12,15.5Z" />
            </svg>

            <svg
              className="swap-off fill-current h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
            >
              <path d="M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49a8.59,8.59,0,0,1,.25-2A1,1,0,0,0,8,2.36,10.14,10.14,0,1,0,22,14.05,1,1,0,0,0,21.64,13Zm-9.5,6.69A8.14,8.14,0,0,1,7.08,5.22v.27A10.15,10.15,0,0,0,17.22,15.63a9.79,9.79,0,0,0,2.1-.22A8.11,8.11,0,0,1,12.14,19.73Z" />
            </svg>
          </label>
        </div>

        <div className="dropdown dropdown-end">
          <label tabIndex="0" className="btn btn-ghost btn-circle avatar">
            <div className="w-10 rounded-full">
              <img
                alt="Profile"
                src="https://pixel-profile-pic.herokuapp.com/api?width=20&cell=5&color=4da3ff&seed=johndoe"
              />
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
              <a>Logout</a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
