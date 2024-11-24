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
  const [walletType, setWalletType] = useState(""); // Add walletType state

  const handleAuthorization = (address, walletType) => {
    setIsAuthorized(true);
    setUserAddress(address);
    setWalletType(walletType); // Store the wallet type
  };

  return (
    <Router>
      <div className="app">
        {!isAuthorized ? (
          <Authorization onAuthorized={handleAuthorization} />
        ) : (
          <div>
            <div className="top-bar">
              <AccountMenu userAddress={userAddress} />
            </div>
            <Routes>
              <Route
                path="/"
                element={<Pack userAddress={userAddress} walletType={walletType} />}
              />
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
