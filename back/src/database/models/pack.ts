import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../db";

interface PackAttributes {
  id: number;
  user_id: number;
  opened_at?: Date;
}

// Define creation attributes for Sequelize
interface PackCreationAttributes extends Optional<PackAttributes, "id"> {}

export class Pack
  extends Model<PackAttributes, PackCreationAttributes>
  implements PackAttributes
{
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
    tableName: "packs",
  }
);

export default Pack;
