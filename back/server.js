const http = require("http");
const fs = require("fs");

const PORT = 5000;

// Load data from JSON files
const teachers = JSON.parse(fs.readFileSync("./cards_data/teachers.json", "utf8"));
const rarities = JSON.parse(fs.readFileSync("./cards_data/rarities.json", "utf8"));

// Create an HTTP server
const server = http.createServer((req, res) => {
  const url = req.url;
  const method = req.method;

  // Enable CORS to allow frontend requests
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // Handle OPTIONS preflight requests
  if (method === "OPTIONS") {
    res.writeHead(204);
    res.end();
    return;
  }

  // Route: Generate a pack of cards
  if (url === "/api/open-pack" && method === "GET") {
    const newCards = [];

    for (let i = 0; i < 5; i++) {
      // Determine card rarity
      const luck = Math.random();
      let card_rarity = "Common";
      for (let j = 0; j < rarities.length; j++) {
        if (luck >= rarities[j].probability) {
          card_rarity = rarities[j].name;
          break;
        }
      }

      // Select a random teacher
      const teacherIndex = Math.floor(Math.random() * teachers.length);
      const teacher = teachers[teacherIndex];

      // Add the card to the new pack
      newCards.push({
        rarity: card_rarity,
        ...teacher,
      });
    }

    // Respond with the generated pack of cards
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(newCards));
  } 
  // Default route: Not Found
  else {
    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Endpoint not found" }));
  }
});

// Start the server
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
