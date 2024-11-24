import { DataTypes, Model } from "sequelize";
import { sequelize } from "../db";

class User extends Model {
  public id!: number;
  public wallet_address!: string;
  public wallet_type!: "Phantom" | "Solflare" | "Both";
  public packs_opened!: number;
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
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
    tableName: "users",
    timestamps: false, // Disable timestamps
  }
);

export default User;
