import { Link} from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { Menu, X, } from "lucide-react";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const dropdownToggleRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      const dropdown = dropdownRef.current;
      const toggle = dropdownToggleRef.current;
      if (
        dropdown &&
        !dropdown.contains(event.target) &&
        toggle &&
        !toggle.contains(event.target)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const handleUserChange = () => setIsDropdownOpen(false);
    window.addEventListener("userLogin", handleUserChange);
    window.addEventListener("userLogout", handleUserChange);
    return () => {
      window.removeEventListener("userLogin", handleUserChange);
      window.removeEventListener("userLogout", handleUserChange);
    };
  }, []);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);


  return (
    <nav className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="cursor-pointer flex gap-2 items-center">
              <img src="Tarun.png" alt="logo" className="h-8 w-auto" />
            </Link>
          </div>

          <div className="hidden lg:flex items-center mt-4 space-x-8">
            <div className="flex space-x-6">
              <NavLink to="#about">About</NavLink>
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
              <MobileNavLink to="/#about" onClick={toggleMenu}>
                About
              </MobileNavLink>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

const NavLink = ({ to, children }) => (
  <Link
    to={to}
    className="text-gray-700 hover:text-[#387cf9] text-sm font-medium transition-colors duration-200"
  >
    {children}
  </Link>
);

const MobileNavLink = ({ to, children, onClick }) => (
  <Link
    to={to}
    className="text-gray-700 hover:text-[#387cf9] text-base font-medium w-full text-center py-2"
    onClick={onClick}
  >
    {children}
  </Link>
);
