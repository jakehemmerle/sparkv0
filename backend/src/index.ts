import express, { Request, Response } from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import sessionsRouter from './routes/sessions'
import './services/database' // Initialize database on startup

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3002

// Middleware
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Routes
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', message: 'Spark API is running' })
})

app.use('/api/sessions', sessionsRouter)

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`)
})

export default app
