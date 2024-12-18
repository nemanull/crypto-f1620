"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const teachers_json_1 = __importDefault(require("./cards_data/teachers.json"));
const rarities_json_1 = __importDefault(require("./cards_data/rarities.json"));
// Initialize the app and define the port
const app = (0, express_1.default)();
const PORT = 5000;
// Load data from JSON files
const teachers = teachers_json_1.default;
const rarities = rarities_json_1.default;
// Enable CORS to allow frontend requests
app.use((0, cors_1.default)()); // Enable default CORS for all origins and methods
// Route: Generate a pack of cards
app.get("/api/open-pack", (req, res) => {
    const newCards = [];
    for (let i = 0; i < 5; i++) {
        // Determine card rarity
        const luck = Math.random();
        let card_rarity = "Common";
        for (const rarity of rarities) {
            if (luck >= rarity.probability) {
                card_rarity = rarity.name;
                break;
            }
        }
        // Select a random teacher
        const teacher = teachers[Math.floor(Math.random() * teachers.length)];
        // Add the card to the new pack
        newCards.push(Object.assign({ rarity: card_rarity }, teacher));
    }
    // Respond with the generated pack of cards
    res.status(200).json(newCards);
});
// Default route: Not Found
app.use((req, res) => {
    res.status(404).json({ error: "Endpoint not found" });
});
// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
