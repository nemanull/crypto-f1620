module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("users", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      wallet_address: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      wallet_type: {
        type: Sequelize.ENUM("Phantom", "Solflare", "Both"),
        allowNull: false,
      },
      packs_opened: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
    });

    await queryInterface.createTable("packs", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: "users", key: "id" },
        onDelete: "CASCADE",
      },
      opened_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
    });

    await queryInterface.createTable("cards", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      pack_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: "packs", key: "id" },
        onDelete: "CASCADE",
      },
      teacher_name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      hp: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      type: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      rarity: {
        type: Sequelize.ENUM("Common", "Uncommon", "Rare", "Epic", "Mythic", "Legendary"),
        allowNull: false,
      },
      attack_1_name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      attack_1_damage: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      attack_1_energy: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      attack_2_name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      attack_2_damage: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      attack_2_energy: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      special_skill: {
        type: Sequelize.STRING,
        allowNull: false,
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("cards");
    await queryInterface.dropTable("packs");
    await queryInterface.dropTable("users");
  },
};
