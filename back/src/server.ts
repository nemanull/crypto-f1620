import express, { Request, Response } from "express";
import cors from "cors";
import teachersData from "./cards_data/teachers.json";
import raritiesData from "./cards_data/rarities.json";

// Initialize the app and define the port
const app = express();
const PORT = 5000;

// Define types for the data
interface Teacher {
  teacher_name: string;
  hp: string;
  type: string;
  attacks: {
    attack_1: {
      attack_name: string;
      attack_damage: string;
      attack_energy_require: string;
    };
    attack_2: {
      attack_name: string;
      attack_damage: string;
      attack_energy_require: string;
    };
  };
  special_skill: string;
}

interface Rarity {
  name: string;
  probability: number;
}

// Load data from JSON files
const teachers: Teacher[] = teachersData as Teacher[];
const rarities: Rarity[] = raritiesData as Rarity[];

// Enable CORS to allow frontend requests
app.use(cors()); // Enable default CORS for all origins and methods

// Route: Generate a pack of cards
app.get("/api/open-pack", (req: Request, res: Response) => {
  const newCards: Array<{ rarity: string } & Teacher> = [];

  for (let i = 0; i < 5; i++) {
    // Determine card rarity
    const luck = Math.random();
    let card_rarity = "Common";
    for (const rarity of rarities) {
      if (luck >= rarity.probability) {
        card_rarity = rarity.name;
        break;
      }
    }

    // Select a random teacher
    const teacher = teachers[Math.floor(Math.random() * teachers.length)];

    // Add the card to the new pack
    newCards.push({
      rarity: card_rarity,
      ...teacher,
    });
  }

  // Respond with the generated pack of cards
  res.status(200).json(newCards);
});

// Default route: Not Found
app.use((req: Request, res: Response) => {
  res.status(404).json({ error: "Endpoint not found" });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
