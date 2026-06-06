import React, { useState } from "react";
import { Moon, Sun, User } from 'lucide-react';
// import { AiOutlineSun } from "react-icons/ai";
import "./Navbar.css";

const Navbar = ({isDarkMode, setIsDarkMode}) => {
  // const [isDarkMode, setIsDarkMode] = useState(true);
  const [isMenuActive, setIsMenuActive] = useState(false);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.body.classList.toggle("darkmode", !isDarkMode);
  };

  const toggleMenu = () => {
    setIsMenuActive(!isMenuActive);
  };

  function refreshPage() {
    window.location.reload(false);
  }

  // Close menu when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (isMenuActive && !event.target.closest('.menu')) {
        setIsMenuActive(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMenuActive]);

  return (
    <div className={`navbar ${isDarkMode ? 'dark' : 'light'}`}>
      <div className="logo" onClick={refreshPage}>
        Sudoku Solver
      </div>
      <div className="Rightcomp">
        <div 
          className="dark-toggle" 
          onClick={toggleDarkMode}
          role="button"
          aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
        >
          {isDarkMode ? <Moon size={20} /> : <Sun size={20} />}
        </div>
        <div className="menu">
          <ul className="menu-inner">
            <li className="menu-item">
              <button 
                className="menu-link"
                onClick={toggleMenu}
                aria-expanded={isMenuActive}
                aria-haspopup="true"
              >
                <User size={20} />
                
              </button>
              {isMenuActive && (
                <div 
                  className={`submenu active`}
                  role="menu"
                >
                  <ul className="submenu-list">
                    <li>
                      <button className="submenu-item" role="menuitem">Login</button>
                    </li>
                    <li>
                      <button className="submenu-item" role="menuitem">Register</button>
                    </li>
                  </ul>
                </div>
              )}
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
