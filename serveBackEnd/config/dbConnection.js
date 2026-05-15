import mongoose from "mongoose";

const dbConnection = async () => {
    try {
        await mongoose.connect(process.env.DATABASE_URI)
    } catch(error) {
        throw error
    }
}

export default dbConnection
