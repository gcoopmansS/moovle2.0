import { Outlet, Link, useLocation } from "react-router-dom";
import { BellIcon, UserCircleIcon, MenuIcon } from "./icons";
import { useState } from "react";

export default function Layout() {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isActiveTab = (path: string) => location.pathname === path;

  const tabClass = (path: string) =>
    `relative px-6 py-3 font-bold text-lg transition-all duration-300 ${
      isActiveTab(path)
        ? "text-indigo-600 bg-indigo-50 rounded-xl shadow-md"
        : "text-gray-600 hover:text-indigo-600 hover:bg-gray-50 rounded-xl"
    }`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Bold Header */}
      <header className="sticky top-0 bg-white/90 backdrop-blur-xl border-b-2 border-indigo-100 shadow-xl z-50">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="flex items-center justify-between h-20">
            {/* Bold Logo */}
            <div className="flex items-center">
              <Link
                to="/"
                className="text-3xl font-black bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent hover:scale-105 transition-transform"
              >
                Moovle 🏸
              </Link>
            </div>

            {/* Enhanced Navigation */}
            <nav className="hidden md:flex items-center space-x-2 bg-gray-100 p-2 rounded-2xl">
              <Link to="/feed" className={tabClass("/feed")}>
                Feed
              </Link>
              <Link to="/agenda" className={tabClass("/agenda")}>
                Agenda
              </Link>
              <Link to="/create" className={tabClass("/create")}>
                Create
              </Link>
            </nav>

            {/* Right Side with bold styling */}
            <div className="flex items-center space-x-3">
              {/* Mobile menu button */}
              <button
                className="md:hidden p-3 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-2xl transition-all duration-200"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                <MenuIcon className="w-6 h-6" />
              </button>

              <Link
                to="/notifications"
                className="relative p-3 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-2xl transition-all duration-200"
              >
                <BellIcon className="w-6 h-6" />
                {/* Bold notification badge */}
                <span className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold shadow-lg">
                  3
                </span>
              </Link>

              {/* Profile with gradient */}
              <button className="p-3 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-2xl transition-all duration-200">
                <UserCircleIcon className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Enhanced Mobile Navigation */}
          {isMobileMenuOpen && (
            <div className="md:hidden border-t border-gray-200 py-4 bg-white/95 backdrop-blur-xl">
              <nav className="flex flex-col space-y-2">
                <Link
                  to="/feed"
                  className={`px-4 py-3 font-bold text-lg transition-all duration-200 ${
                    isActiveTab("/feed")
                      ? "text-indigo-600 bg-indigo-50 rounded-xl"
                      : "text-gray-600 hover:text-indigo-600 hover:bg-gray-50 rounded-xl"
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Feed
                </Link>
                <Link
                  to="/agenda"
                  className={`px-4 py-3 font-bold text-lg transition-all duration-200 ${
                    isActiveTab("/agenda")
                      ? "text-indigo-600 bg-indigo-50 rounded-xl"
                      : "text-gray-600 hover:text-indigo-600 hover:bg-gray-50 rounded-xl"
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Agenda
                </Link>
                <Link
                  to="/create"
                  className={`px-4 py-3 font-bold text-lg transition-all duration-200 ${
                    isActiveTab("/create")
                      ? "text-indigo-600 bg-indigo-50 rounded-xl"
                      : "text-gray-600 hover:text-indigo-600 hover:bg-gray-50 rounded-xl"
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Create
                </Link>
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Main Content with enhanced padding */}
      <main className="max-w-7xl mx-auto p-6 md:p-8">
        <Outlet />
      </main>
    </div>
  );
}
