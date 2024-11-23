import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Pack from "./components/Pack";
import Authorization from "./components/Authorization";
import AccountMenu from "./components/AccountMenu/AccountMenu";
import Profile from "./components/Profile/Profile";
import Collection from "./components/Collection/Collection";
import Settings from "./components/Settings/Settings";

const App = () => {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [userAddress, setUserAddress] = useState("");

  const handleAuthorization = (address) => {
    setIsAuthorized(true);
    setUserAddress(address); // Pass the connected wallet address
  };

  return (
    <Router>
      <div className="app">
        {!isAuthorized ? (
          // Show Authorization component until the user connects their wallet
          <Authorization onAuthorized={handleAuthorization} />
        ) : (
          // Render the main app after successful authorization
          <div>
            <div className="top-bar">
              <AccountMenu userAddress={userAddress} />
            </div>
            <Routes>
              <Route path="/" element={<Pack />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/collection" element={<Collection />} />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </div>
        )}
      </div>
    </Router>
  );
};

export default App;
