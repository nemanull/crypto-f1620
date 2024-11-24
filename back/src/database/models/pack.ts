import { DataTypes, Model } from "sequelize";
import { sequelize } from "../db";

class Pack extends Model {
  public id!: number;
  public user_id!: number;
  public opened_at!: Date;
}

Pack.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    opened_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    modelName: "Pack",
    tableName: "packs",
    timestamps: false, // Disable timestamps
  }
);

export default Pack;
