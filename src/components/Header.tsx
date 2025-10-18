import { Link, useLocation } from "react-router-dom";
import { BellIcon, UserCircleIcon, MenuIcon } from "./icons";
import { useState } from "react";

export default function Header() {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isActiveTab = (path: string) => location.pathname === path;

  const tabClass = (path: string) =>
    `relative px-4 py-2 text-sm font-medium transition-all duration-200 ${
      isActiveTab(path)
        ? "text-gray-900 bg-gray-100"
        : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
    } rounded-lg`;

  return (
    <header className="sticky top-0 bg-white/80 backdrop-blur-md border-b border-gray-200/50 z-50">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Minimal Logo */}
          <div className="flex items-center">
            <Link
              to="/"
              className="text-xl font-semibold text-gray-900 hover:text-gray-700 transition-colors"
            >
              Moovle
            </Link>
          </div>

          {/* Minimal Navigation */}
          <nav className="hidden md:flex items-center space-x-1 bg-gray-100/50 p-1 rounded-lg">
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

          {/* Minimal Right Side */}
          <div className="flex items-center space-x-2">
            {/* Mobile menu button */}
            <button
              className="md:hidden p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <MenuIcon className="w-5 h-5" />
            </button>

            <Link
              to="/notifications"
              className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
            >
              <BellIcon className="w-5 h-5" />
              {/* Minimal notification badge */}
              <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center text-[10px] font-medium">
                3
              </span>
            </Link>

            {/* Profile button */}
            <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors">
              <UserCircleIcon className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Minimal Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200/50 py-3 bg-white/80">
            <nav className="flex flex-col space-y-1">
              <Link
                to="/feed"
                className={`px-4 py-2 text-sm font-medium transition-colors ${
                  isActiveTab("/feed")
                    ? "text-gray-900 bg-gray-100"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                } rounded-lg`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Feed
              </Link>
              <Link
                to="/agenda"
                className={`px-4 py-2 text-sm font-medium transition-colors ${
                  isActiveTab("/agenda")
                    ? "text-gray-900 bg-gray-100"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                } rounded-lg`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Agenda
              </Link>
              <Link
                to="/create"
                className={`px-4 py-2 text-sm font-medium transition-colors ${
                  isActiveTab("/create")
                    ? "text-gray-900 bg-gray-100"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                } rounded-lg`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Create
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
