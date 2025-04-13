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
  .then(() => {
    console.log("Database Synced");
    // Run the seeder
    const seeder = require('./seeders/20250413120000-create-roles');
    return seeder.up(db.sequelize.getQueryInterface(), db.Sequelize);
  })
  .then(() => console.log("Roles seeded"))
  .catch((err) => console.error("Sequelize Sync Error:", err));

app.get("/", (req, res) => res.send("Backend is running!"));

app.get("/notes", async (req, res) => {
  try {
    const notes = await db.Note.findAll({
      where: {
        is_deleted: false
      },
      include: [{
        model: db.User,
        as: 'user',
        attributes: ['nickname']
      }],
      order: [['created_at', 'DESC']]
    });

    const formattedNotes = notes.map(note => ({
      id: note.id,
      nickName: note.user.nickname,
      note: note.note,
      noteColor: note.note_color,
      createdAt: note.created_at,
      updatedAt: note.updated_at
    }));

    res.json(formattedNotes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/notes", async (req, res) => {
  try {
    const { nickName, note, noteColor } = req.body;

    // Find the user by nickname
    const user = await db.User.findOne({
      where: {
        nickname: nickName,
        is_deleted: false
      }
    });

    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }

    const newNote = await db.Note.create({
      user_id: user.id,
      note: note,
      note_color: noteColor,
      created_at: new Date(),
      updated_at: new Date()
    });

    // Fetch the created note with user information
    const createdNote = await db.Note.findByPk(newNote.id, {
      include: [{
        model: db.User,
        as: 'user',
        attributes: ['nickname']
      }]
    });

    res.status(201).json({
      id: createdNote.id,
      nickName: createdNote.user.nickname,
      note: createdNote.note,
      noteColor: createdNote.note_color,
      createdAt: createdNote.created_at,
      updatedAt: createdNote.updated_at
    });
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

// User endpoints
app.get("/users", async (req, res) => {
  try {
    const users = await db.User.findAll({
      where: {
        is_deleted: false
      },
      include: [{
        model: db.Role,
        as: 'role',
        attributes: ['role_title']
      }]
    });
    
    // Transform the response to match frontend expectations
    const transformedUsers = users.map(user => ({
      id: user.id,
      nickname: user.nickname,
      role: user.role ? user.role.role_title : 'User'
    }));
    
    res.json(transformedUsers);
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({ error: err.message });
  }
});

app.post("/users", async (req, res) => {
  try {
    const { nickname, role_id } = req.body;
    
    // Validate required fields
    if (!nickname || !role_id) {
      return res.status(400).json({ error: "Nickname and role_id are required" });
    }

    // Check if role exists
    const role = await db.Role.findByPk(role_id);
    if (!role) {
      return res.status(400).json({ error: "Invalid role_id" });
    }

    // Check if user with same nickname already exists
    const existingUser = await db.User.findOne({
      where: {
        nickname: nickname,
        is_deleted: false
      }
    });

    if (existingUser) {
      return res.status(400).json({ error: "User with this nickname already exists" });
    }

    const newUser = await db.User.create({
      nickname,
      role_id,
      is_deleted: false,
      created_at: new Date(),
      updated_at: new Date()
    });

    // Fetch the created user with role information
    const createdUser = await db.User.findByPk(newUser.id, {
      include: [{
        model: db.Role,
        as: 'role',
        attributes: ['role_title']
      }]
    });

    res.status(201).json({
      id: createdUser.id,
      nickname: createdUser.nickname,
      role: createdUser.role.role_title
    });
  } catch (err) {
    console.error('Error creating user:', err);
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 6408;
app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
