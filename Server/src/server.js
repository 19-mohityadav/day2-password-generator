import express from 'express'
import cors from 'cors'

const app = express()
const PORT = 5000

// Middleware
app.use(cors())
app.use(express.json())

// In-memory storage
let passwordHistory = []

// Routes
app.get('/api/data', (req, res) => {
  res.json([])
})

app.post('/api/passwords', (req, res) => {
  const { password, length } = req.body;

  // 1️⃣ Validate input
  if (!password || password.length < 4) {
    return res.status(400).json({ error: "Invalid password" });
  }

  // 2️⃣ Check for duplicate password
  const alreadyExists = passwordHistory.some(
    (item) => item.password === password
  );

  if (alreadyExists) {
    return res.status(409).json({ error: "Password already exists" });
  }

  // 3️⃣ Save only if unique
  const entry = {
    id: Date.now(),
    password,
    length,
    createdAt: new Date().toISOString(),
  };

  passwordHistory.push(entry);
  res.json(entry);
});


app.post('/api/passwords', (req, res) => {
  const entry = { id: Date.now(), ...req.body, createdAt: new Date().toISOString() }
  passwordHistory.push(entry)
  res.json(entry)
})

app.delete('/api/passwords/:id', (req, res) => {
  passwordHistory = passwordHistory.filter(p => p.id !== parseInt(req.params.id))
  res.json({ message: 'Deleted' })
})

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})
