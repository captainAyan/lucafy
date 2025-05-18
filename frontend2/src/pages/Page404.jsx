import { NavLink } from "react-router-dom";

import Button from "../components/Button";

export default function Page404() {
  return (
    <div className="flex flex-col h-screen justify-between">
      <main className="h-full flex text-center">
        <div className="m-auto w-auto">
          <img src="/logo-light.png" alt="Logo" className="h-8 mb-8 m-auto" />
          <p className="text-base font-semibold text-indigo-600">404</p>
          <h1 className="mt-4 text-5xl font-semibold tracking-tight text-balance text-gray-900 sm:text-7xl">
            Page not found
          </h1>
          <p className="mt-6 text-lg font-medium text-pretty text-gray-500 sm:text-xl/8">
            Sorry, we couldn&apos;t find the page you&apos;re looking for.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <NavLink to="/">
              <Button className="h-12 px-4 !capitalize">Go back home</Button>
            </NavLink>
            <a href="#" className="text-sm font-semibold text-gray-900">
              Contact support <span aria-hidden="true">&rarr;</span>
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}
