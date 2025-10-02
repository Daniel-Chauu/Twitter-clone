import mongoose from 'mongoose'
import 'dotenv/config'

const connectMongoDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI as string)
    console.log(`MongoDB connected: ${conn.connection.host}`)
  } catch (error: any) {
    console.error(`Error connection to mongoDB: $${error.message}`)
    process.exit(1)
  }
}

export default connectMongoDB
