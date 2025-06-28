import { LogOut, Menu, User, X } from "lucide-react";
import { useState } from "react";
import { Link as RouterLink, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const { isAuthenticated, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  return (
    <header className="bg-slate-800 border-b border-slate-700 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <RouterLink to={"/"}>
            <div className="flex items-center">
              <div className="text-2xl font-bold text-emerald-400">
                <img className="w-16" src="/logo.png" alt="logo" />
              </div>
              <div className="text-2xl font-bold text-emerald-400">
                Swastha Bharat
              </div>
            </div></RouterLink>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <RouterLink to={"/"}>
              <button
                onClick={() => scrollToSection('home')}
                className={`font-medium transition-colors ${location.pathname === "/"
                  ? "text-emerald-400 hover:text-emerald-300"
                  : "text-slate-300 hover:text-white"
                  }`}
              >
                Home
              </button>
            </RouterLink>
            <RouterLink to={'/book'}>
              <button
                className={`font-medium transition-colors ${location.pathname === "/book"
                  ? "text-emerald-400 hover:text-emerald-300"
                  : "text-slate-300 hover:text-white"
                  }`}
              >
                Book an Appointment
              </button>
            </RouterLink>
            <RouterLink to={"/order"}>
              <button
                className={`font-medium transition-colors ${location.pathname === "/order"
                  ? "text-emerald-400 hover:text-emerald-300"
                  : "text-slate-300 hover:text-white"
                  }`}
              >
                Order Medicine
              </button>
            </RouterLink>
            <RouterLink to={'/profile'}><button
              className={`font-medium transition-colors ${location.pathname === "/profile"
                ? "text-emerald-400 hover:text-emerald-300"
                : "text-slate-300 hover:text-white"
                }`}
            >
              Profile
            </button></RouterLink>
            {isAdmin && (
              <RouterLink to={'/admin'}><button
                className={`font-medium transition-colors ${location.pathname === "/admin"
                  ? "text-emerald-400 hover:text-emerald-300"
                  : "text-slate-300 hover:text-white"
                  }`}
              >
                Admin
              </button></RouterLink>)}
          </nav>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {!isAuthenticated ? (
              <>
                <RouterLink to={'/login'}>
                  <button className="flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg transition-colors">
                    <User className="w-4 h-4" />
                    <span>Login</span>
                  </button>
                </RouterLink>
                <RouterLink to={'/register'}>
                  <button className="flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg transition-colors">
                    <User className="w-4 h-4" />
                    <span>Register</span>
                  </button>
                </RouterLink>
              </>
            ) : (
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-slate-400 hover:text-white"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-slate-700 rounded-lg mt-2">
              <RouterLink to={"/"}>
                <button
                  onClick={() => scrollToSection('home')}
                  className={`block px-3 py-2 text-base font-medium w-full text-left transition-colors ${location.pathname === "/"
                    ? "text-emerald-400 hover:text-emerald-300"
                    : "text-slate-300 hover:text-white"
                    }`}
                >
                  Home
                </button>
              </RouterLink>
              <RouterLink to={"/book"}>
                <button
                  className={`block px-3 py-2 text-base font-medium w-full text-left transition-colors ${location.pathname === "/book"
                    ? "text-emerald-400 hover:text-emerald-300"
                    : "text-slate-300 hover:text-white"
                    }`}
                >
                  Book an Appointment
                </button>
              </RouterLink>
              <RouterLink to={'/order'}>
                <button
                  className={`block px-3 py-2 text-base font-medium w-full text-left transition-colors ${location.pathname === "/order"
                    ? "text-emerald-400 hover:text-emerald-300"
                    : "text-slate-300 hover:text-white"
                    }`}
                >
                  Order Medicine
                </button>
              </RouterLink>
              <RouterLink to={"/profile"}><button
                className={`block px-3 py-2 text-base font-medium w-full text-left transition-colors ${location.pathname === "/profile"
                  ? "text-emerald-400 hover:text-emerald-300"
                  : "text-slate-300 hover:text-white"
                  }`}             >
                Profile
              </button></RouterLink>
              {isAdmin && <RouterLink to={"/admin"}><button
                className={`block px-3 py-2 text-base font-medium w-full text-left transition-colors ${location.pathname === "/admin"
                  ? "text-emerald-400 hover:text-emerald-300"
                  : "text-slate-300 hover:text-white"
                  }`}             >
                Admin
              </button></RouterLink>}
              {!isAuthenticated ? (
                <div className="flex flex-col gap-2 mt-2">
                  <RouterLink to={'/login'}>
                    <button className="flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-2 rounded-lg transition-colors w-full">
                      <User className="w-4 h-4" />
                      <span>Login</span>
                    </button>
                  </RouterLink>
                  <RouterLink to={'/register'}>
                    <button className="flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-2 rounded-lg transition-colors w-full">
                      <User className="w-4 h-4" />
                      <span>Register</span>
                    </button>
                  </RouterLink>
                </div>
              ) : (
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg transition-colors w-full mt-2"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;