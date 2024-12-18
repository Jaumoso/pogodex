const express = require("express");
const cors = require("cors");
const sqlite3 = require("sqlite3").verbose();
const bodyParser = require("body-parser");
const RateLimit = require("express-rate-limit");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const limiter = RateLimit({
  windowsMs: 5 * 60 * 1000, // 5 minutes
  max: 100, // max 100 requests per windowMS
});

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(limiter);

// Trust frontend proxy
app.set("trust proxy", 1);

// Connection to SQLite database
const db = new sqlite3.Database("./db/pokemon.db", (err) => {
  if (err) {
    console.error("Error opening database:", err.message);
  } else {
    db.serialize(() => {
      db.run(
        `CREATE TABLE IF NOT EXISTS trainers (
          id INTEGER PRIMARY KEY, 
          username VARCHAR(50) UNIQUE NOT NULL, 
          passwordHash VARCHAR(255) NOT NULL,
          role TEXT DEFAULT 'User' CHECK(role IN ('User', 'Admin')),
          advancedChecklist BOOLEAN DEFAULT FALSE,
          createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`
      );

      db.run(
        `CREATE TABLE IF NOT EXISTS pokemons (
          id INTEGER PRIMARY KEY,
          trainerId INT NOT NULL,
          templateId VARCHAR(50) NOT NULL,
          caught BOOLEAN DEFAULT FALSE,
          male BOOLEAN DEFAULT FALSE,
          female BOOLEAN DEFAULT FALSE,
          genderless BOOLEAN DEFAULT FALSE,
          normal3stars BOOLEAN DEFAULT FALSE,
          shiny BOOLEAN DEFAULT FALSE,
          shiny3star BOOLEAN DEFAULT FALSE,
          perfect BOOLEAN DEFAULT FALSE,
          lucky BOOLEAN DEFAULT FALSE,
          shadow BOOLEAN DEFAULT FALSE,
          purified BOOLEAN DEFAULT FALSE,
          FOREIGN KEY (trainerId) REFERENCES trainers(id) ON DELETE CASCADE
        )`
      );
    });
  }
});

// Obtain all captured pokemon
app.get("/api/pokemon/:id", (req, res) => {
  db.all(
    `SELECT * FROM pokemons po JOIN trainers tr ON po.trainerId = tr.id WHERE tr.id = ?`,
    [req.params.id],
    (err, rows) => {
      if (err) {
        res.status(500).json({ error: err.message });
      }
      res.json(rows);
    }
  );
});

// Add a new captured pokemon
app.post("/api/pokemon/:id", (req, res) => {
  const {
    id,
    trainerId,
    templateId,
    male,
    female,
    genderless,
    normal3stars,
    shiny,
    shiny3star,
    perfect,
    lucky,
    shadow,
    purified,
  } = req.body;
  const sql =
    "INSERT INTO pokemons (id, trainerId, templateId, male, female, genderless, normal3stars, shiny, shiny3star, perfect, lucky, shadow, purified) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
  const params = [
    id,
    trainerId,
    templateId,
    male,
    female,
    genderless,
    normal3stars,
    shiny,
    shiny3star,
    perfect,
    lucky,
    shadow,
    purified,
  ];
  db.run(sql, params, function (err) {
    if (err) {
      res.status(500).json({ error: err.message });
    }
    res.json({ message: "New pokemon added to pokedex" });
  });
});

// Modify a captured pokemon
app.put("/api/pokemon/:id", (req, res) => {
  const {
    trainerId,
    templateId,
    male,
    female,
    genderless,
    normal3stars,
    shiny,
    shiny3star,
    perfect,
    lucky,
    shadow,
    purified,
  } = req.body;
  const sql =
    "UPDATE pokemons SET male = ?, female = ?, genderless = ?, normal3stars = ?, shiny = ?, shiny3stars = ?, perfect = ?, lucky = ?, shadow = ?, purified = ? WHERE trainerId = ? AND templateId = ?";
  const params = [
    male,
    female,
    genderless,
    normal3stars,
    shiny,
    shiny3star,
    perfect,
    lucky,
    shadow,
    purified,
    trainerId,
    templateId,
  ];
  db.run(sql, params, function (err) {
    if (err) {
      res.status(500).json({ error: err.message });
    }
    res.json({ message: "Changes were registered in the pokedex" });
  });
});

// Remove a captured pokemon
app.delete("/api/pokemon/:id", (req, res) => {
  const { trainerId, templateId } = req.body;
  const sql = "DELETE FROM pokemons WHERE trainerId = ? AND templateId = ?";
  const params = [trainerId, templateId];
  db.run(sql, params, function (err) {
    if (err) {
      res.status(500).json({ error: err.message });
    }
    res.json({ message: "Pokemon removed from pokedex" });
  });
});

// Register a new trainer
app.post("/api/auth/register", async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Username and password are required" });
  }

  try {
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const role = "User";
    const advancedChecklist = 0;
    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;

    const sql =
      "INSERT INTO trainers (username, passwordHash, role, advancedChecklist, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?)";
    const params = [
      username,
      passwordHash,
      role,
      advancedChecklist,
      createdAt,
      updatedAt,
    ];
    db.run(sql, params, function (err) {
      if (err) {
        console.error("Database error:", err.message);
        if (err.code === "SQLITE_CONSTRAINT") {
          return res.status(400).json({ message: "Username already exists" });
        }
        return res.status(500).json({ message: "Database error" });
      }
      res.status(201).json({ message: "User registered successfully" });
    });
  } catch (err) {
    console.error("Internal server error:", err.message);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Trainer login
app.post("/api/auth/login", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Username and password are required" });
  }
  const sql =
    "SELECT id, username, passwordHash FROM trainers WHERE username = ?";
  db.get(sql, username, async function (err, user) {
    if (err) {
      return res.status(500).json({ message: "Database error" });
    }
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user.id, username },
      process.env.JWT_SECRET_KEY,
      {
        expiresIn: "1h",
      }
    );

    res.status(200).json({ message: "Login successful", token });
  });
});

// Delete a trainer
app.delete("/api/trainer/:id", (req, res) => {
  const trainerId = req.params.id;
  const sqlTrainer = "DELETE FROM trainers WHERE id = ?";
  db.run(sqlTrainer, trainerId, function (err) {
    if (err) {
      return res
        .status(500)
        .json({ error: "Error deleting trainer: " + err.message });
    }

    res.status(200).json({
      message: "Trainer and associated pokemons deleted successfully",
    });
  });
});

// app.get("/api/trainer/profile", (req, res) => {
//   const authHeader = req.headers.authorization;
//   if (!authHeader || !authHeader.startsWith("Bearer ")) {
//     return res.status(401).json({ message: "Token required" });
//   }
//   const token = authHeader.split(" ")[1];
//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
//     res.status(200).json({ message: "Profile data", user: decoded });
//   } catch (err) {
//     res.status(401).json({ message: "Invalid or expired token" });
//   }
// });

// Turn on the server
app.listen(PORT, "0.0.0.0", () => {
  console.log(`API Server running on port ${PORT}`);
});
