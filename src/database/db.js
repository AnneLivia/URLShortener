import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const DATABASE_URL = process.env.DATABASE_URL;

// connecting to mongo db
mongoose.connect(DATABASE_URL)
.then( () => console.log("MongoDB connected!"))
.catch((err) => console.error(err));

export default mongoose;