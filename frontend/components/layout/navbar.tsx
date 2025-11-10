"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Menu, X, User, LogOut } from "lucide-react";
import { useRef } from "react";

interface User {
  id: number;
  name: string;
  email: string;
  mobile_number: string;
  documentId: string;
}

export default function Navbar() {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const dropdownToggleRef = useRef<HTMLButtonElement>(null);
  const [user, setUser] = useState<User | null>(null);
  const isLoggedIn = !!user;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const dropdown = dropdownRef.current;
      const toggle = dropdownToggleRef.current;
      if (
        dropdown &&
        !dropdown.contains(event.target as Node) &&
        toggle &&
        !toggle.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const handleUserChange = () => setIsDropdownOpen(false);
    window.addEventListener('userLogin', handleUserChange);
    window.addEventListener('userLogout', handleUserChange);
    return () => {
      window.removeEventListener('userLogin', handleUserChange);
      window.removeEventListener('userLogout', handleUserChange);
    };
  }, []);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleDropdown = () => setIsDropdownOpen(prev => !prev);

  const handleLogout = () => {
    // Add your logout logic here (e.g., clear user state, call API, etc.)
    setIsDropdownOpen(false);
    router.push("/");
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
      <div className="mx-auto  px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="cursor-pointer flex gap-2 items-center">
              <img
                src="Tarun.png"
                alt="logo"
                className="h-8 w-auto"
              />
            </Link>
          </div>

          <div className="hidden lg:flex items-center mt-4 space-x-8">
            <div className="flex space-x-6">
              <NavLink href="#">Courses</NavLink>
              <NavLink href="#mentors">Mentors</NavLink>
              <NavLink href="#about">About</NavLink>
            </div>

            <div className="flex items-center space-x-4 ml-4">
           

              {isLoggedIn ? (
                <div className="relative">
                  <button
                    ref={dropdownToggleRef}
                    onClick={toggleDropdown}
                    className="flex items-center space-x-2 text-gray-700 hover:text-[#387cf9] text-sm font-medium p-2 transition-colors"
                  >
                    <User className="h-4 w-4" />
                    <span className="max-w-[120px] truncate">{user?.name}</span>
                  </button>

                  {isDropdownOpen && (
                    <div
                      ref={dropdownRef}
                      className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-md shadow-lg z-10"
                    >
                      <div className="py-1">
                        <div className="px-4 py-2 text-sm text-gray-700 border-b border-gray-100">
                          <p className="font-medium truncate">{user?.name}</p>
                          <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                        </div>
                        <button
                          onClick={handleLogout}
                          className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
                        >
                          <LogOut className="h-4 w-4" />
                          <span>Logout</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <AuthButton mode="login">Sign In</AuthButton>
                  <AuthButton mode="register" primary>Get Started</AuthButton>
                </>
              )}
            </div>
          </div>

          <div className="lg:hidden mt-4 flex items-center">
            <button 
              onClick={toggleMenu}
              className="text-gray-700 hover:text-[#387cf9] p-2 focus:outline-none"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="lg:hidden bg-white border-t border-gray-100">
            <div className="flex flex-col items-center space-y-4 py-4 px-4">
              <MobileNavLink href="/courses" onClick={toggleMenu}>Courses</MobileNavLink>
              <MobileNavLink href="/#mentors" onClick={toggleMenu}>Mentors</MobileNavLink>
              <MobileNavLink href="/#about" onClick={toggleMenu}>About</MobileNavLink>
              
              <Link
                href="https://play.google.com/"
                className="text-sm font-semibold bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-800 bg-clip-text text-transparent hover:from-blue-400 hover:to-indigo-500 transition-all duration-300 py-2"
                onClick={toggleMenu}
              >
                Download app
              </Link>

              {isLoggedIn ? (
                <>
                  <div className="text-center border-t border-gray-200 pt-4 w-full">
                    <p className="text-gray-700 font-medium truncate px-4">{user?.name}</p>
                    <p className="text-xs text-gray-500 truncate px-4">{user?.email}</p>
                  </div>
                  <button
                    onClick={() => {
                      handleLogout();
                      toggleMenu();
                    }}
                    className="text-red-600 hover:text-red-700 text-base font-medium flex items-center space-x-2 py-2"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Logout</span>
                  </button>
                </>
              ) : (
                <div className="flex flex-col w-full space-y-3 pt-2">
                  <AuthButton mobile mode="login" onClick={toggleMenu}>Sign In</AuthButton>
                  <AuthButton mobile primary mode="register" onClick={toggleMenu}>Get Started</AuthButton>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

const NavLink = ({ href, children }: { href: string; children: React.ReactNode }) => (
  <Link 
    href={href} 
    className="text-gray-700 hover:text-[#387cf9] text-sm font-medium transition-colors duration-200"
  >
    {children}
  </Link>
);

const MobileNavLink = ({ 
  href, 
  children, 
  onClick 
}: { 
  href: string; 
  children: React.ReactNode;
  onClick: () => void;
}) => (
  <Link
    href={href}
    className="text-gray-700 hover:text-[#387cf9] text-base font-medium w-full text-center py-2"
    onClick={onClick}
  >
    {children}
  </Link>
);

const AuthButton = ({
  children,
  mode,
  primary = false,
  mobile = false,
  onClick
}: {
  children: React.ReactNode;
  mode: "login" | "register";
  primary?: boolean;
  mobile?: boolean;
  onClick?: () => void;
}) => {
  const router = useRouter();
  
  const handleClick = () => {
    router.push(`/auth?mode=${mode}`);
    onClick?.();
  };

  return (
    <button
      onClick={handleClick}
      className={`
        ${mobile ? 'w-full py-3 text-base' : 'px-4 cursor-pointer py-2 text-sm'}
        font-medium rounded-xl transition-colors duration-200
        ${primary 
          ? 'bg-[#387cf9] hover:bg-[#3e38f9] text-white' 
          : 'text-gray-700 hover:text-[#387cf9] border border-gray-500'}
      `}
    >
      {children}
    </button>
  );
};