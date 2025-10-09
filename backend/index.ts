import bodyParser from 'body-parser'
import cors from 'cors'
import 'dotenv/config'
import express from 'express'
import connectMongoDB from './db/connectMongoDB'
import rootRoute from './routes/root.route'
import cloudinaryConfig from './utils/cloudinary'

cloudinaryConfig()

const app = express()
const PORT = process.env.PORT

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cors())

app.use('/api', rootRoute)

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT} : http://localhost:${PORT}`)
  connectMongoDB()
})
