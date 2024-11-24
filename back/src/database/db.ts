import { Sequelize } from "sequelize";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(__dirname, ".env") });


// Debug log
console.log({
  DB_NAME: process.env.DB_NAME,
  DB_USER: process.env.DB_USER,
  DB_PASSWORD: process.env.DB_PASSWORD,
  DB_HOST: process.env.DB_HOST,
  DB_PORT: process.env.DB_PORT,
});

export const sequelize = new Sequelize(
  process.env.DB_NAME || "crypto_f1620",
  process.env.DB_USER || "root",
  process.env.DB_PASSWORD || "",
  {
    host: process.env.DB_HOST || "localhost",
    dialect: "mysql",
    logging: console.log, // Enable logging for debugging
  }
);


// Lazy loading models to avoid circular dependencies
import User from "./models/user";
import Pack from "./models/pack";
import Card from "./models/card";

// Initialize model relationships
User.hasMany(Pack, { foreignKey: "user_id", as: "packs" });
Pack.belongsTo(User, { foreignKey: "user_id", as: "user" });

Pack.hasMany(Card, { foreignKey: "pack_id", as: "cards" });
Card.belongsTo(Pack, { foreignKey: "pack_id", as: "pack" });

export { User, Pack, Card };
