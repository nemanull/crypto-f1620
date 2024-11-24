import { DataTypes, Model } from "sequelize";
import { sequelize } from "../db";

class User extends Model {
  public id!: number;
  public wallet_address!: string;
  public wallet_type!: "Phantom" | "Solflare" | "Both";
  public packs_opened!: number;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

User.init(
  {
    wallet_address: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    wallet_type: {
      type: DataTypes.ENUM("Phantom", "Solflare", "Both"),
      allowNull: false,
    },
    packs_opened: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  },
  {
    sequelize,
    modelName: "User",
    tableName: "users", // Ensure this matches your database table name
  }
);

export default User;
