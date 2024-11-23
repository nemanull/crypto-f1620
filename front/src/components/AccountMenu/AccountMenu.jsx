import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./AccountMenu.css";

const AccountMenu = ({ userAddress }) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  return (
    <div className="account-menu-container">
      {/* Circle in the top-left corner leading to the Pack page */}
      <Link to="/" className="pack-circle">
        <div className="pack-icon"></div>
      </Link>

      {/* Account Menu */}
      <div
        className="account-menu"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className="avatar-display">
          <div className="avatar"></div>
          <span className="wallet-address">
            {userAddress.slice(0, 6)}...{userAddress.slice(-4)}
          </span>
        </div>
        {isHovered && (
          <div className="dropdown">
            <div className="dropdown-item">
              <Link to="/profile">Profile</Link>
            </div>
            <div className="dropdown-item">
              <Link to="/collection">Collection</Link>
            </div>
            <div className="dropdown-item">
              <Link to="/settings">Settings</Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AccountMenu;
