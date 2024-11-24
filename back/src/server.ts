import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import { sequelize } from "./database/db";
import User from "./database/models/user";
import Pack from "./database/models/pack";
import Card from "./database/models/card";
import teachersData from "./cards_data/teachers.json";
import raritiesData from "./cards_data/rarities.json";

const app = express();
const PORT = 5000;

// Middleware
app.use(express.json());
app.use(cors());

// Data
const teachers = teachersData;
const rarities = raritiesData;


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



// Initialize the app and database
(async () => {
  try {
    console.log("Connecting to the database...");
    await sequelize.authenticate();
    console.log("Database connection successful.");

    // Routes
   // Route: Generate a pack of cards and save to the database
app.post(
  "/api/open-pack",
  async (req: Request, res: Response, next: NextFunction) => {
    console.log("POST /api/open-pack hit with body:", req.body);
    let transaction;
    try {
      const { wallet_address, wallet_type } = req.body as {
        wallet_address: string;
        wallet_type: "Phantom" | "Solflare" | "Both";
      };

      if (!wallet_address || !wallet_type) {
        return res
          .status(400)
          .json({ error: "Missing wallet_address or wallet_type in request body" });
      }

      // Start a transaction
      transaction = await sequelize.transaction();

      // Find or create the user
      let user = await User.findOne({ where: { wallet_address }, transaction });
      if (!user) {
        user = await User.create(
          {
            wallet_address,
            wallet_type,
            packs_opened: 0,
          },
          { transaction }
        );
      } else {
        // Update wallet_type if it differs
        if (user.wallet_type !== wallet_type) {
          user.wallet_type = wallet_type;
          await user.save({ transaction });
        }
      }

      const newCards: Array<{ rarity: string } & Teacher> = [];

      // Insert a new pack for the user
      const pack = await Pack.create({ user_id: user.id }, { transaction });

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

      // Increment packs_opened for the user
      await user.increment("packs_opened", { by: 1, transaction });

      // Commit the transaction
      await transaction.commit();

      res.status(200).json(newCards);
    } catch (error) {
      console.error("Error handling /api/open-pack:", error);
      if (transaction) {
        await transaction.rollback();
      }
      next(error); // Pass the error to the default error handler
    }
  }
);

////////////////////
  // Or, app.post can be written in a different way, avoiding interface.

  // app.post("/api/open-pack", async (req, res, next) => {
  //   console.log("POST /api/open-pack hit with body:", req.body);

  //   let transaction;

  //   try {
  //     const { wallet_address, wallet_type } = req.body;
  //     if (!wallet_address || !wallet_type) {
  //       return res
  //         .status(400)
  //         .json({ error: "Missing wallet_address or wallet_type in request body" });
  //     }

  //     // Find or create user
  //     let user = await User.findOne({ where: { wallet_address } });
  //     if (!user) {
  //       user = await User.create({
  //         wallet_address,
  //         wallet_type,
  //         packs_opened: 0,
  //       });
  //     }

  //     transaction = await sequelize.transaction();

  //     // Create a new pack
  //     const pack = await Pack.create({ user_id: user.id }, { transaction });

  //     // Generate cards
  //     const newCards = [];


  //    for (let i = 0; i < 5; i++) {
  //      const luck = Math.random();
  //      let card_rarity = "Common";
  //      for (const rarity of rarities) {
  //        if (luck >= rarity.probability) {
  //          card_rarity = rarity.name;
  //          break;
  //        }
  //      }

  //      const teacher = teachers[Math.floor(Math.random() * teachers.length)];

  //      await Card.create(
  //        {
  //          pack_id: pack.getDataValue("id"),
  //          teacher_name: teacher.teacher_name,
  //          hp: teacher.hp,
  //          type: teacher.type,
  //          rarity: card_rarity,
  //          attack_1_name: teacher.attacks.attack_1.attack_name,
  //          attack_1_damage: teacher.attacks.attack_1.attack_damage,
  //          attack_1_energy: teacher.attacks.attack_1.attack_energy_require,
  //          attack_2_name: teacher.attacks.attack_2.attack_name,
  //          attack_2_damage: teacher.attacks.attack_2.attack_damage,
  //          attack_2_energy: teacher.attacks.attack_2.attack_energy_require,
  //          special_skill: teacher.special_skill,
  //        },
  //        { transaction }
  //      );

  //      // Include `attacks` in the newCards object
  //      newCards.push({
  //        rarity: card_rarity,
  //        teacher_name: teacher.teacher_name,
  //        hp: teacher.hp,
  //        type: teacher.type,
  //        special_skill: teacher.special_skill,
  //        attacks: {
  //          attack_1: teacher.attacks.attack_1,
  //          attack_2: teacher.attacks.attack_2,
  //        },
  //      });
  //    }

  //     await user.increment("packs_opened", { by: 1, transaction });
  //     await transaction.commit();

  //     res.status(200).json(newCards);
  //   } catch (error) {
  //     if (transaction) {
  //       await transaction.rollback();
  //     }
  //     console.error("Error handling /api/open-pack:", error);
  //     next(error);
  //   }
  // });



  ///////////






    app.use((req, res) => {
      res.status(404).json({ error: "Endpoint not found" });
    });

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Fatal error during server startup:", error);
    process.exit(1);
  }
})();

// Gracefully shut down the database connection
process.on("SIGINT", async () => {
  console.log("Shutting down gracefully...");
  await sequelize.close();
  console.log("Database connection closed.");
  process.exit(0);
});
