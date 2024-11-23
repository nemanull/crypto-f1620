import React, { useState } from "react";
import "./Pack.css";

const Pack = () => {
  const [cards, setCards] = useState([]);
  const [packOpened, setPackOpened] = useState(false);

  const packOpen = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/open-pack");
      const data = await response.json();
      setCards(data);
      setPackOpened(true);
    } catch (error) {
      console.error("Error fetching pack:", error);
    }
  };

  const resetPack = () => {
    setCards([]);
    setPackOpened(false);
  };

  return (
    <div className="pack-container">
      {!packOpened ? (
        <div className="pack">
          <button className="pack_button" onClick={packOpen}>
            Open the pack
          </button>
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
