import React, { useState } from "react";
import "./Pack.css";

const Pack = ({ userAddress, walletType }) => {
  const [cards, setCards] = useState([]);
  const [packOpened, setPackOpened] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const packOpen = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/open-pack", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          wallet_address: userAddress,
          wallet_type: walletType,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (!Array.isArray(data) || data.length !== 5) {
        throw new Error("Invalid pack data. Expected 5 unique cards.");
      }

      console.log("Received Pack Data:", data);
      setCards(data);
      setPackOpened(true);
      setErrorMessage("");
    } catch (error) {
      console.error("Error fetching pack:", error);
      setErrorMessage("Failed to load the pack. Please try again.");
    }
  };

  const resetPack = () => {
    setCards([]);
    setPackOpened(false);
    setErrorMessage("");
  };

  return (
    <div className="pack-container">
      {!packOpened ? (
        <div className="pack">
          <button className="pack_button" onClick={packOpen}>
            Open the pack
          </button>
          {errorMessage && <p className="error">{errorMessage}</p>}
        </div>
      ) : (
        <div>
          <div className="card-container">
            {cards.map((card, index) => (
              <div className="card" key={index}>
                <div className="card-header">
                  <div className="rarity">{card.rarity}</div>
                  <div className="hp">{card.hp} HP</div>
                </div>
                <div className="card-image">
                  <p>{card.teacher_name}</p>
                </div>
                <div className="card-content">
                  <div className="energy">
                    <div>
                      {card.attacks?.attack_1?.attack_energy_require || "N/A"}{" "}
                      {card.attacks?.attack_1?.attack_name || "N/A"}
                    </div>
                    <div className="attack-damage">
                      {card.attacks?.attack_1?.attack_damage || "N/A"}
                    </div>
                  </div>
                  <div className="energy">
                    <div>
                      {card.attacks?.attack_2?.attack_energy_require || "N/A"}{" "}
                      {card.attacks?.attack_2?.attack_name || "N/A"}
                    </div>
                    <div className="attack-damage">
                      {card.attacks?.attack_2?.attack_damage || "N/A"}
                    </div>
                  </div>
                </div>
                <div className="special-skill">
                  Special Skill: {card.special_skill || "N/A"}
                </div>
              </div>
            ))}
          </div>
          <div className="button-container">
            <button className="refresh_button" onClick={resetPack}>
              Reset Pack
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Pack;
