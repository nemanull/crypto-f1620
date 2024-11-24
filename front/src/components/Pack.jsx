import React, { useState } from "react";
import "./Pack.css";

const Pack = () => {
  const [cards, setCards] = useState([]); // Holds the cards from the opened pack
  const [packOpened, setPackOpened] = useState(false); // Tracks whether the pack is opened
  const [errorMessage, setErrorMessage] = useState(""); // Error message for API failures

  const packOpen = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/open-pack");

      // Handle HTTP errors
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (!Array.isArray(data) || data.length !== 5) {
        throw new Error("Invalid pack data. Expected 5 unique cards.");
      }

      console.log("Received Pack Data:", data); // Debugging log
      setCards(data); // Save the pack data in state
      setPackOpened(true); // Indicate the pack has been opened
      setErrorMessage(""); // Clear any previous errors
    } catch (error) {
      console.error("Error fetching pack:", error);
      setErrorMessage("Failed to load the pack. Please try again.");
    }
  };

  const resetPack = () => {
    setCards([]); // Clear the cards
    setPackOpened(false); // Reset the pack state
    setErrorMessage(""); // Clear error messages
  };

  return (
    <div className="pack-container">
      {!packOpened ? (
        <div className="pack">
          <button className="pack_button" onClick={packOpen}>
            Open the pack
          </button>
          {errorMessage && <p className="error">{errorMessage}</p>} {/* Display error if any */}
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
                      {card.attacks.attack_1.attack_energy_require}{" "}
                      {card.attacks.attack_1.attack_name}
                    </div>
                    <div className="attack-damage">
                      {card.attacks.attack_1.attack_damage}
                    </div>
                  </div>
                  <div className="energy">
                    <div>
                      {card.attacks.attack_2.attack_energy_require}{" "}
                      {card.attacks.attack_2.attack_name}
                    </div>
                    <div className="attack-damage">
                      {card.attacks.attack_2.attack_damage}
                    </div>
                  </div>
                </div>
                <div className="special-skill">
                  Special Skill: {card.special_skill}
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
