import { sequelize } from "./db";

(async () => {
  try {
    console.log("Testing database connection...");
    await sequelize.authenticate();
    console.log("Database connection successful.");
  } catch (error) {
    console.error("Database connection error:", error);
  } finally {
    await sequelize.close();
    console.log("Database connection closed.");
  }
})();
