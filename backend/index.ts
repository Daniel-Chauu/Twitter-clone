import express from 'express'
import 'dotenv/config'
import cors from 'cors'
import rootRoute from './routes/root.route'
import connectMongoDB from './db/connectMongoDB'
import { errorHandler } from './utils/defaultErrorHandler'

const app = express()
const PORT = process.env.PORT

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors())
app.use('/api', rootRoute)

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT} : http://localhost:${PORT}`)
  connectMongoDB()
})
