import express, { Request, Response, NextFunction } from "express";
import { RequestHandler } from "express";
import cors from "cors";
import { sequelize } from "./database/db";
import teachersData from "./cards_data/teachers.json";
import raritiesData from "./cards_data/rarities.json";
import User from "./database/models/user";
import Pack from "./database/models/pack";
import Card from "./database/models/card";

// Initialize the app and define the port
const app = express();
const PORT = 5000;

// Middleware for parsing JSON
app.use(express.json());
app.use(cors()); // Enable CORS for all origins and methods

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

// Test database connection
sequelize
  .authenticate()
  .then(() => console.log("Database connected successfully."))
  .catch((err) => console.error("Database connection failed:", err));

// Route: Generate a pack of cards and save to the database

//////// APi open pack //////////

app.post(
  "/api/open-pack",
  (async (req: Request, res: Response) => {
    try {
      const { userId } = req.body as { userId: number }; // Type assertion for request body
      if (!userId) {
        return res.status(400).json({ error: "Missing userId in request body" });
      }

      const newCards: Array<{ rarity: string } & Teacher> = [];
      const transaction = await sequelize.transaction();

      // Insert a new pack for the user
      const pack = await Pack.create({ user_id: userId }, { transaction });

      for (let i = 0; i < 5; i++) {
        const luck = Math.random();
        let card_rarity = "Common";
        for (const rarity of rarities) {
          if (luck >= rarity.probability) {
            card_rarity = rarity.name;
            break;
          }
        }

        const teacher = teachers[Math.floor(Math.random() * teachers.length)];

        await Card.create(
          {
            pack_id: pack.getDataValue("id"),
            teacher_name: teacher.teacher_name,
            hp: teacher.hp,
            type: teacher.type,
            rarity: card_rarity,
            attack_1_name: teacher.attacks.attack_1.attack_name,
            attack_1_damage: teacher.attacks.attack_1.attack_damage,
            attack_1_energy: teacher.attacks.attack_1.attack_energy_require,
            attack_2_name: teacher.attacks.attack_2.attack_name,
            attack_2_damage: teacher.attacks.attack_2.attack_damage,
            attack_2_energy: teacher.attacks.attack_2.attack_energy_require,
            special_skill: teacher.special_skill,
          },
          { transaction }
        );

        newCards.push({
          rarity: card_rarity,
          ...teacher,
        });
      }

      await transaction.commit();

      res.status(200).json(newCards);
    } catch (error) {
      console.error("Error handling /api/open-pack:", error);
      res.status(500).json({ error: "Failed to open pack" });
    }
  }) as RequestHandler
);





/////////////////////////// 2nd part of the code /////////////////////////////

// Route: Fetch users from MySQL
app.get("/api/users", async (req: Request, res: Response) => {
  try {
    const users = await User.findAll(); // Fetch all users from the database
    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

// Default route: Not Found
app.use((req: Request, res: Response) => {
  res.status(404).json({ error: "Endpoint not found" });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
