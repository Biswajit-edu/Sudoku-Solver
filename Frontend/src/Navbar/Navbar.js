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

  return (
        <div className="navbar">
      <div className="logo" onClick={refreshPage}> Sudoku Solver </div>
      <div className="Rightcomp">
        <div className="dark-toggle" onClick={toggleDarkMode}>
          {isDarkMode ? <Moon/> : <Sun/>}
        </div>
        <div className={`menu`}>
          <ul className="menu-inner">
            <li className="menu-item" onClick={toggleMenu}>
              <a className="menu-link">
                <User/> <i className="bx bx-chevron-right"></i>
              </a>
              <div className={`submenu ${isDarkMode ? 'dark_card' : 'light_card'} ${isMenuActive ? "active" : ""}`}>
                <ul className="submenu-list">
                  <button className="submenu-item">Login</button>
                  <button className="submenu-item">Register</button>
                </ul>
              </div>
            </li>
          </ul>
        </div>
      </div>
      </div>
  );
};

export default Navbar;
