import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FileText, LogOut, Menu, X, ChevronDown } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Define a flag that returns true if the current route should have a colored navbar
  const isColoredPage =
    location.pathname === "/dashboard" ||
    location.pathname === "/saved-resumes";

  // Use startsWith for robust active route matching
  const isActive = (path: string) => location.pathname.startsWith(path);

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-300 ${
        isColoredPage
          ? "bg-[#0F74AA]"
          : isScrolled
          ? "bg-white shadow-lg"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div
              className={`p-2 rounded-xl transition-all duration-300 ${
                isColoredPage || isScrolled
                  ? "bg-primary-50 text-primary-600"
                  : "bg-white/10 text-white"
              }`}
            >
              <FileText className="h-8 w-8" />
            </div>
            <span
              className={`text-xl font-bold font-heading transition-colors duration-300 ${
                isColoredPage || isScrolled ? "text-gray-900" : "text-white"
              }`}
            >
              Rocket Resume
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {isAuthenticated ? (
              <>
                <NavLink
                  to="/dashboard"
                  isActive={isActive("/dashboard")}
                  isScrolled={isColoredPage || isScrolled}
                >
                  Dashboard
                </NavLink>
                <NavLink
                  to="/saved-resumes"
                  isActive={isActive("/saved-resumes")}
                  isScrolled={isColoredPage || isScrolled}
                >
                  My Resumes
                </NavLink>
                {/* User Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className={`flex items-center px-4 py-2 rounded-lg transition-all duration-300 ${
                      isColoredPage
                        ? "bg-[#0F74AA] text-white hover:bg-[#0F74AA]/90"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    <span className="mr-2 font-medium">
                      {user?.name || "User"}
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 transition-transform duration-300 ${
                        isDropdownOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden">
                      <div className="px-4 py-3 text-sm text-gray-600 bg-gray-50">
                        {user?.email}
                      </div>
                      <hr className="border-gray-200" />
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center transition-colors duration-300"
                      >
                        <LogOut className="h-4 w-4 mr-2 text-gray-500" />
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <NavLink
                  to="/login"
                  isActive={isActive("/login")}
                  isScrolled={isColoredPage || isScrolled}
                >
                  Login
                </NavLink>
                <Link
                  to="/signup"
                  className={`px-6 py-2.5 rounded-lg font-semibold transition-all duration-300 ${
                    isColoredPage || isScrolled
                      ? "bg-primary-600 text-white hover:bg-primary-700"
                      : "bg-white text-primary-600 hover:bg-primary-50"
                  }`}
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`md:hidden p-2 rounded-lg transition-colors duration-300 ${
              isColoredPage || isScrolled ? "text-gray-600" : "text-white"
            }`}
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-t">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {isAuthenticated ? (
                <>
                  <MobileNavLink
                    to="/dashboard"
                    isActive={isActive("/dashboard")}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Dashboard
                  </MobileNavLink>
                  <MobileNavLink
                    to="/saved-resumes"
                    isActive={isActive("/saved-resumes")}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    My Resumes
                  </MobileNavLink>
                  <div className="px-4 py-2 text-sm text-gray-600">
                    {user?.email}
                  </div>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full flex items-center px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <MobileNavLink
                    to="/login"
                    isActive={isActive("/login")}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Login
                  </MobileNavLink>
                  <MobileNavLink
                    to="/signup"
                    isActive={isActive("/signup")}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Sign Up
                  </MobileNavLink>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

interface NavLinkProps {
  to: string;
  isActive: boolean;
  isScrolled: boolean;
  children: React.ReactNode;
}

const NavLink = ({ to, isActive, isScrolled, children }: NavLinkProps) => (
  <Link
    to={to}
    className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
      isActive
        ? "text-white bg-primary-600"
        : isScrolled
        ? "text-white-100 hover:text-black-600"
        : "text-white hover:bg-white/10"
    }`}
  >
    {children}
  </Link>
);

interface MobileNavLinkProps {
  to: string;
  isActive: boolean;
  onClick: () => void;
  children: React.ReactNode;
}

const MobileNavLink = ({
  to,
  isActive,
  onClick,
  children,
}: MobileNavLinkProps) => (
  <Link
    to={to}
    onClick={onClick}
    className={`block px-4 py-3 rounded-lg font-medium ${
      isActive
        ? "text-primary-600 bg-primary-50"
        : "text-gray-600 hover:bg-white-50"
    }`}
  >
    {children}
  </Link>
);

export default Navbar;
