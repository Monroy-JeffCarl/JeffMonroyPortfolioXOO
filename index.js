require("dotenv").config();
const express = require("express");
const cors = require("cors");
const db = require("./models/index.js");

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:5175"], 
    methods: "GET,POST,PUT,DELETE",
    allowedHeaders: "Content-Type",
  })
);

db.sequelize
  .authenticate()
  .then(() => console.log("Database connected"))
  .catch((err) => console.error("DB Connection Error:", err));

db.sequelize
  .sync({ alter: true })
  .then(() => console.log("DB Synced"))
  .catch((err) => console.error("Sequelize Sync Error:", err));

app.get("/", (req, res) => res.send("Backend is running!"));

app.get("/notes", async (req, res) => {
  try {
    const notes = await db.Note.findAll({
      where: {
        is_deleted: false
      }
    });
    res.json(notes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/notes", async (req, res) => {
  try {
    const { nickName, note, noteColor } = req.body;
    const newNote = await db.Note.create({ nickName, note, noteColor });
    res.json(newNote);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put("/notes/:id", async (req, res) => {
  try {
    const { nickName, note, noteColor } = req.body;
    const updatedNote = await db.Note.update(
      { nickName, note, noteColor },
      { where: { id: req.params.id } }
    );
    if (updatedNote[0] === 0) {
      return res.status(404).json({ error: "Note not found" });
    }
    res.json({ message: "Note updated" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete("/notes/:id", async (req, res) => {
  try {
    const note = await db.Note.findByPk(req.params.id);
    if (!note) return res.status(404).json({ error: "Note not found" });
    
    await note.update({
      is_deleted: true,
      deletedAt: new Date()
    });
    
    res.json({ message: "Note soft deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 6408;
app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
