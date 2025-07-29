const auth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: "No token" });

  try {
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch {
    return res.status(403).json({ error: "Invalid token" });
  }
};

// ✅ NOTES ROUTES



// GET all notes
app.get("/notes", auth, async (req, res) => {
  const notes = await Note.find({ userId: req.userId });
  res.json(notes);
});

// POST create note
app.post("/notes", auth, async (req, res) => {
  const note = new Note({ userId: req.userId, content: req.body.content });
  await note.save();
  res.json(note);
});

// PUT update note
app.put("/notes/:id", auth, async (req, res) => {
  const note = await Note.findOneAndUpdate(
    { _id: req.params.id, userId: req.userId },
    { content: req.body.content },
    { new: true }
  );
  res.json(note);
});

// DELETE a note
app.delete("/notes/:id", auth, async (req, res) => {
  await Note.findOneAndDelete({ _id: req.params.id, userId: req.userId });
  res.json({ message: "Note deleted" });
});

