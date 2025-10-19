import { Link, useLocation } from "react-router-dom";
import { BellIcon, MenuIcon } from "./icons";
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
    `relative px-6 py-3 text-sm font-medium transition-all duration-300 ease-out ${
      isActiveTab(path)
        ? "text-gray-900 bg-white shadow-sm border border-gray-200/50"
        : "text-gray-500 hover:text-gray-900 hover:bg-white/60"
    } rounded-xl`;

  return (
    <header className="sticky top-0 bg-white/90 backdrop-blur-xl border-b border-gray-100/80 z-50">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex items-center justify-between h-20">
          {/* Modern Logo */}
          <div className="flex items-center">
            <Link
              to="/"
              className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent hover:from-gray-700 hover:to-gray-500 transition-all duration-300"
            >
              Moovle
            </Link>
          </div>

          {/* Modern Navigation Pills */}
          <nav className="hidden md:flex items-center space-x-2 bg-gray-50/80 p-2 rounded-2xl backdrop-blur-sm border border-gray-200/30">
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
                className="relative p-3 text-gray-500 hover:text-gray-900 hover:bg-white/80 rounded-xl transition-all duration-300 hover:shadow-sm border border-transparent hover:border-gray-200/50 group"
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

            {/* Modern Mobile menu button */}
            <button
              className="md:hidden relative p-3 text-gray-500 hover:text-gray-900 hover:bg-white/80 rounded-xl transition-all duration-300 hover:shadow-sm border border-transparent hover:border-gray-200/50"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <MenuIcon className="w-5 h-5" />
            </button>

            {/* Modern Notifications button */}
            <Link
              to="/notifications"
              className="relative group p-3 text-gray-500 hover:text-gray-900 hover:bg-white/80 rounded-xl transition-all duration-300 hover:shadow-sm border border-transparent hover:border-gray-200/50"
            >
              <BellIcon className="w-5 h-5" />
              {/* Modern notification badge */}
              <span className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center text-[10px] font-semibold shadow-lg group-hover:scale-110 transition-transform duration-200">
                3
              </span>
            </Link>

            {/* Auth Section */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                  className="flex items-center space-x-2 p-2 text-gray-500 hover:text-gray-900 hover:bg-white/80 rounded-xl transition-all duration-300 hover:shadow-sm border border-transparent hover:border-gray-200/50"
                >
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                    {user?.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm font-medium hidden sm:block">
                    {user?.name}
                  </span>
                </button>

                {/* Profile Dropdown */}
                {isProfileMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white/95 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-200/50 py-2 z-50">
                    <div className="px-4 py-2 border-b border-gray-100">
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
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => setIsLoginOpen(true)}
                className="px-6 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-medium hover:from-blue-700 hover:to-blue-800 transition-all transform hover:scale-[1.02] shadow-sm"
              >
                Sign In
              </button>
            )}
          </div>
        </div>

        {/* Modern Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-100/80 py-4 bg-white/95 backdrop-blur-xl">
            <nav className="flex flex-col space-y-2">
              <Link
                to="/dashboard"
                className={`mx-4 px-4 py-3 text-sm font-medium transition-all duration-300 ${
                  isActiveTab("/dashboard")
                    ? "text-gray-900 bg-white shadow-sm border border-gray-200/50"
                    : "text-gray-500 hover:text-gray-900 hover:bg-white/60"
                } rounded-xl`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Dashboard
              </Link>
              <Link
                to="/mates"
                className={`mx-4 px-4 py-3 text-sm font-medium transition-all duration-300 ${
                  isActiveTab("/mates")
                    ? "text-gray-900 bg-white shadow-sm border border-gray-200/50"
                    : "text-gray-500 hover:text-gray-900 hover:bg-white/60"
                } rounded-xl`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Mates
              </Link>
              <Link
                to="/agenda"
                className={`mx-4 px-4 py-3 text-sm font-medium transition-all duration-300 ${
                  isActiveTab("/agenda")
                    ? "text-gray-900 bg-white shadow-sm border border-gray-200/50"
                    : "text-gray-500 hover:text-gray-900 hover:bg-white/60"
                } rounded-xl`}
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
                className="mx-4 px-4 py-3 text-sm font-medium transition-all duration-300 text-gray-500 hover:text-gray-900 hover:bg-white/60 rounded-xl flex items-center space-x-2"
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
