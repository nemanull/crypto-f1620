import { DataTypes, Model } from "sequelize";
import { sequelize } from "../db";
import Pack from "./pack";

class Card extends Model {
  public id!: number;
  public pack_id!: number;
  public teacher_name!: string;
  public hp!: string;
  public type!: string;
  public rarity!: "Common" | "Uncommon" | "Rare" | "Epic" | "Mythic" | "Legendary";
  public attack_1_name!: string;
  public attack_1_damage!: string;
  public attack_1_energy!: string;
  public attack_2_name!: string;
  public attack_2_damage!: string;
  public attack_2_energy!: string;
  public special_skill!: string;
}

Card.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    pack_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: Pack, key: "id" },
      onDelete: "CASCADE",
    },
    teacher_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    hp: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    rarity: {
      type: DataTypes.ENUM("Common", "Uncommon", "Rare", "Epic", "Mythic", "Legendary"),
      allowNull: false,
    },
    attack_1_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    attack_1_damage: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    attack_1_energy: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    attack_2_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    attack_2_damage: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    attack_2_energy: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    special_skill: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "Card",
    tableName: "cards", // Ensure it matches your database table name
    timestamps: false, // Disable timestamps
  }
);

export default Card;
