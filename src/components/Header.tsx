import { Link, useLocation } from "react-router-dom";
import { HiBars3 } from "react-icons/hi2";
import { HiOutlineBell } from "react-icons/hi";
import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { Login } from "./Login";

interface HeaderProps {
  onOpenCreateModal: () => void;
}

export default function Header({ onOpenCreateModal }: HeaderProps) {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();

  const isActiveTab = (path: string) => location.pathname === path;

  const tabClass = (path: string) =>
    `relative px-6 py-3 text-sm font-medium transition-all duration-300 ease-out cursor-pointer ${
      isActiveTab(path)
        ? "text-gray-900 bg-white shadow-sm border-b-2 border-gray-900"
        : "text-gray-500 hover:text-gray-900 hover:border-b-2 hover:border-gray-300"
    }`;

  return (
    <header className="sticky top-0 bg-white/90 backdrop-blur-xl border-b border-gray-100/80 z-50">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex items-center justify-between h-20">
          {/* Modern Logo */}
          <div className="flex items-center">
            <Link
              to="/"
              className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent hover:from-gray-700 hover:to-gray-500 transition-all duration-300 cursor-pointer"
            >
              Moovle
            </Link>
          </div>

          {/* Modern Navigation */}
          <nav className="hidden md:flex items-center">
            <Link to="/dashboard" className={tabClass("/dashboard")}>
              Dashboard
            </Link>
            <Link to="/mates" className={tabClass("/mates")}>
              Mates
            </Link>
            <Link to="/agenda" className={tabClass("/agenda")}>
              Agenda
            </Link>
          </nav>

          {/* Modern Action Buttons */}
          <div className="flex items-center space-x-3">
            {/* Create Activity Button - Only show when authenticated */}
            {isAuthenticated && (
              <button
                onClick={onOpenCreateModal}
                className="relative p-3 text-gray-500 hover:text-gray-900 hover:bg-gray-50 transition-all duration-200 group cursor-pointer"
                title="Create Activity"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
              </button>
            )}

            {/* Mobile menu button */}
            <button
              className="md:hidden relative p-3 text-gray-500 hover:text-gray-900 hover:bg-gray-50 transition-all duration-200 cursor-pointer"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <HiBars3 className="w-5 h-5" />
            </button>

            {/* Notifications button */}
            <Link
              to="/notifications"
              className="relative group p-3 text-gray-500 hover:text-gray-900 hover:bg-gray-50 transition-all duration-200 cursor-pointer"
            >
              <HiOutlineBell className="w-5 h-5" />
              {/* Notification badge */}
              <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-xs w-4 h-4 flex items-center justify-center text-[10px] font-medium">
                3
              </span>
            </Link>

            {/* Auth Section */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                  className="flex items-center space-x-2 p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-50 transition-all duration-200 cursor-pointer"
                >
                  <div className="w-8 h-8 bg-gray-900 flex items-center justify-center text-white text-sm font-medium">
                    {user?.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm font-medium hidden sm:block">
                    {user?.name}
                  </span>
                </button>

                {/* Profile Dropdown */}
                {isProfileMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg border border-gray-200 py-1 z-50">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900">
                        {user?.name}
                      </p>
                      <p className="text-xs text-gray-500">{user?.email}</p>
                    </div>
                    <button
                      onClick={() => {
                        logout();
                        setIsProfileMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => setIsLoginOpen(true)}
                className="px-6 py-2 bg-gray-900 text-white font-medium hover:bg-gray-800 transition-colors cursor-pointer"
              >
                Sign In
              </button>
            )}
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4 bg-white">
            <nav className="flex flex-col space-y-1">
              <Link
                to="/dashboard"
                className={`mx-4 px-4 py-3 text-sm font-medium transition-colors cursor-pointer ${
                  isActiveTab("/dashboard")
                    ? "text-gray-900 border-l-2 border-gray-900 bg-gray-50"
                    : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Dashboard
              </Link>
              <Link
                to="/mates"
                className={`mx-4 px-4 py-3 text-sm font-medium transition-colors cursor-pointer ${
                  isActiveTab("/mates")
                    ? "text-gray-900 border-l-2 border-gray-900 bg-gray-50"
                    : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Mates
              </Link>
              <Link
                to="/agenda"
                className={`mx-4 px-4 py-3 text-sm font-medium transition-colors cursor-pointer ${
                  isActiveTab("/agenda")
                    ? "text-gray-900 border-l-2 border-gray-900 bg-gray-50"
                    : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Agenda
              </Link>

              {/* Create Activity Button for Mobile */}
              <button
                onClick={() => {
                  onOpenCreateModal();
                  setIsMobileMenuOpen(false);
                }}
                className="mx-4 px-4 py-3 text-sm font-medium transition-colors text-gray-500 hover:text-gray-900 hover:bg-gray-50 flex items-center space-x-2 cursor-pointer"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                <span>Create Activity</span>
              </button>
            </nav>
          </div>
        )}
      </div>

      {/* Login Modal */}
      {isLoginOpen && <Login onClose={() => setIsLoginOpen(false)} />}
    </header>
  );
}
