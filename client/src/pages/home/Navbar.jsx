import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="fixed top-0 left-0 z-50 w-full bg-primary/95 backdrop-blur-sm">
      <div className="container mx-auto px-4">
        <div className="relative flex items-center justify-between py-4">
          <div className="w-40 max-w-full">
            <Link to="/" className="block">
              <img
                src="/images/HMSytem-white-logo.png"
                alt="logo"
                className="h-10 w-auto"
              />
            </Link>
          </div>
          
          {/* Desktop Menu */}
          <nav className="hidden lg:block">
            <ul className="flex items-center space-x-8">
              <li>
                <a
                  href="#home"
                  className="text-base font-medium text-white transition duration-300 hover:text-white/80"
                >
                  Home
                </a>
              </li>
              <li>
                <a
                  href="#about"
                  className="text-base font-medium text-white transition duration-300 hover:text-white/80"
                >
                  About
                </a>
              </li>
              <li>
                <a
                  href="#features"
                  className="text-base font-medium text-white transition duration-300 hover:text-white/80"
                >
                  Features
                </a>
              </li>
              <li>
                <a
                  href="#pricing"
                  className="text-base font-medium text-white transition duration-300 hover:text-white/80"
                >
                  Pricing
                </a>
              </li>
              
            </ul>
          </nav>

          {/* Desktop Auth Buttons */}
          <div className="hidden items-center space-x-4 lg:flex">
            <Link
              to="/login"
              className="rounded-md px-6 py-2 text-base font-medium text-white transition duration-300 hover:bg-white/10"
            >
              Log In
            </Link>
            <Link
              to="/register"
              className="rounded-md bg-white px-6 py-2 text-base font-medium text-primary transition duration-300 hover:bg-white/90"
            >
              Sign Up
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMenu}
            className="inline-flex items-center justify-center rounded-md p-2 text-white hover:bg-white/10 lg:hidden"
          >
            <span className="sr-only">Open menu</span>
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {isMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden">
            <div className="space-y-1 px-2 pb-3 pt-2">
              <a
                href="#home"
                className="block rounded-md px-3 py-2 text-base font-medium text-white hover:bg-white/10"
                onClick={toggleMenu}
              >
                Home
              </a>
              <a
                href="#about"
                className="block rounded-md px-3 py-2 text-base font-medium text-white hover:bg-white/10"
                onClick={toggleMenu}
              >
                About
              </a>
              <a
                href="#features"
                className="block rounded-md px-3 py-2 text-base font-medium text-white hover:bg-white/10"
                onClick={toggleMenu}
              >
                Features
              </a>
              <a
                href="#pricing"
                className="block rounded-md px-3 py-2 text-base font-medium text-white hover:bg-white/10"
                onClick={toggleMenu}
              >
                Pricing
              </a>
              <div className="mt-4 space-y-2">
                <Link
                  to="/login"
                  className="block rounded-md px-3 py-2 text-base font-medium text-white hover:bg-white/10"
                  onClick={toggleMenu}
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="block rounded-md bg-white px-3 py-2 text-base font-medium text-primary hover:bg-white/90"
                  onClick={toggleMenu}
                >
                  Sign Up
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;