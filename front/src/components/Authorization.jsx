import React, { useState, useEffect } from "react";
import "./Authorization.css";

const Authorization = ({ onAuthorized }) => {
  const [walletConnected, setWalletConnected] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const connectPhantom = async () => {
    try {
      const solana = window.solana;

      if (!solana || !solana.isPhantom) {
        setErrorMessage("Phantom wallet not detected. Please install Phantom.");
        return;
      }

      const response = await solana.connect();
      if (response && response.publicKey) {
        console.log("Phantom Wallet connected:", response.publicKey.toString());
        setWalletConnected(true);
        onAuthorized(response.publicKey.toString(), "Phantom"); // Pass walletType
      }
    } catch (error) {
      console.error("Phantom wallet connection failed:", error);
      setErrorMessage("Failed to connect Phantom wallet. Please try again.");
    }
  };

  const connectSolflare = async () => {
    try {
      const solflare = window.solflare;

      if (!solflare) {
        setErrorMessage("Solflare wallet not detected. Please install Solflare.");
        return;
      }

      if (!solflare.isConnected) {
        await solflare.connect();
      }

      const publicKey = solflare.publicKey?.toString();

      if (publicKey) {
        console.log("Solflare Wallet connected:", publicKey);
        setWalletConnected(true);
        onAuthorized(publicKey, "Solflare"); // Pass walletType
      } else {
        throw new Error("Public key not found after connecting.");
      }
    } catch (error) {
      console.error("Solflare wallet connection failed:", error);
      setErrorMessage("Failed to connect Solflare wallet. Please try again.");
    }
  };

  useEffect(() => {
    console.log("Checking for connected wallets...");
    if (window.solana && window.solana.isConnected) {
      console.log("Phantom Wallet already connected.");
      setWalletConnected(true);
      onAuthorized(window.solana.publicKey.toString(), "Phantom"); // Pass walletType
    }
  }, [onAuthorized]);

  return (
    <div className="authorization">
      {!walletConnected ? (
        <div>
          <h2>Select a Wallet to Connect</h2>
          <div className="wallet-options">
            <button onClick={connectPhantom} className="wallet-button">
              Connect Phantom Wallet
            </button>
            <button onClick={connectSolflare} className="wallet-button">
              Connect Solflare Wallet
            </button>
          </div>
          <p className="error">{errorMessage}</p>
        </div>
      ) : (
        <div>
          <p>Wallet connected. Access granted!</p>
        </div>
      )}
    </div>
  );
};

export default Authorization;
