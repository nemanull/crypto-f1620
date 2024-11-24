import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config({ path: require('path').resolve(__dirname, "../../.env") });

export const sequelize = new Sequelize(
  process.env.DB_NAME || "my_database",
  process.env.DB_USER || "root",
  process.env.DB_PASSWORD || "",
  {
    host: process.env.DB_HOST || "localhost",
    dialect: "mysql",
    logging: false,
  }
);

// Test connection
(async () => {
  try {
    await sequelize.authenticate();
    console.log("Database connected successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
})();


