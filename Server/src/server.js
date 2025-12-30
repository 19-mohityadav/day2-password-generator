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

app.get('/api/passwords', (req, res) => {
  res.json(passwordHistory)
})

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
