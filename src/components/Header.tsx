import React, { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { gsap } from "gsap";
import { Search, Moon, Sun, Settings, ArrowUpRight, Menu } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { useMovie } from "../context/MovieContext";

const Header: React.FC = () => {
  const { isDark, toggleTheme } = useTheme();
  const { searchMovie, addMovie } = useMovie();
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const headerRef = useRef<HTMLElement>(null);
  const location = useLocation();
  const isHomePage = location.pathname === "/";

  useEffect(() => {
    // Header entrance animation
    gsap.fromTo(
      headerRef.current,
      { y: -100, opacity: 0 },
      { y: 0, opacity: 1, duration: 1.2, ease: "power2.out", delay: 0.5 }
    );
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    const movie = await searchMovie(searchQuery);
    if (movie) {
      addMovie(movie);
      setSearchQuery("");
    }
    setIsSearching(false);
  };

  if (isHomePage) {
    return (
      <header
        ref={headerRef}
        className="fixed top-0 left-0 right-0 z-50 text-white"
      >
        <div className="max-w-screen-2xl mx-auto px-6 md:px-12 py-8">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link
              to="/"
              className="text-2xl font-bold tracking-widest uppercase hover:opacity-80 transition-opacity duration-300"
            >
              SING SING
            </Link>

            {/* Navigation */}
            <div className="flex items-center space-x-6 md:space-x-8">
              <Link to="#" className="flex items-center space-x-2 group">
                <span className="font-semibold tracking-wider uppercase">
                  GET TICKETS
                </span>
                <ArrowUpRight className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
              </Link>
              <button className="flex items-center space-x-2">
                <span className="font-semibold tracking-wider uppercase">
                  MENU
                </span>
                <Menu className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </header>
    );
  }

  // Original Header for other pages
  return (
    <header
      ref={headerRef}
      className="netflix-backdrop border-b border-gray-800/50 sticky top-0 z-40"
      style={{
        background:
          "linear-gradient(180deg, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.7) 100%)",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Netflix-style Logo */}
          <Link
            to="/"
            className="flex items-center space-x-3 text-3xl font-bold text-white hover:text-red-500 transition-all duration-300 transform hover:scale-105"
          >
            <div className="w-10 h-10 bg-gradient-to-r from-red-600 to-red-500 rounded-md flex items-center justify-center">
              <span className="text-white font-black text-xl">N</span>
            </div>
            <span className="netflix-title text-gradient">MovieFlix</span>
          </Link>

          {/* Netflix-style Search Bar */}
          <div className="flex-1 max-w-lg mx-8">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for movies, TV shows, and more..."
                className="netflix-input w-full pl-12 pr-4 py-3 text-lg"
                disabled={isSearching}
              />
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              {isSearching && (
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                  <div className="netflix-loading w-5 h-5 border-2"></div>
                </div>
              )}
            </form>
          </div>

          {/* Netflix-style Theme Toggle & Admin */}
          <div className="flex items-center space-x-4">
            <button
              onClick={toggleTheme}
              className="p-3 rounded-full bg-gray-800/50 text-gray-300 hover:text-white hover:bg-gray-700/50 transition-all duration-300 backdrop-blur-sm"
              title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {isDark ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </button>

            <Link
              to="/admin/login"
              className="flex items-center space-x-2 px-4 py-2 rounded-md bg-gray-800/50 text-gray-300 hover:text-white hover:bg-gray-700/50 transition-all duration-300 backdrop-blur-sm border border-gray-700/50"
            >
              <Settings className="w-4 h-4" />
              <span className="hidden sm:inline netflix-subtitle">Admin</span>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
