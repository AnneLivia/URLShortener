import express from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import mongoose from 'mongoose';

import userRouter  from './routes/userRouter.js';
import shortenerRouter from './routes/shortenerRouter.js';

const app = express();

// The dotenv is a zero-dependency module that loads environment variables from a . env file into process. env 
// this must come before getting variables data, otherwise it get undefined
dotenv.config();

const PORT = process.env.PORT || 3000;
const DATABASE_URL = process.env.DATABASE_URL;

// connecting to mongo db
mongoose.connect(DATABASE_URL)
.then( () => console.log("MongoDB connected."))
.catch( (err) => console.error(err) );

// Middleware to allow receive json from body
app.use(express.json());
// HTTP request logger middleware for node.js
app.use(morgan('dev'));

// Routing defines the way in which the client requests are handled by the application endpoints.
// And when you make some routers in separate file, you can use them by using middleware.
// It is a piece of code that comes in the middle of request and response. 
// It kind of hijacks your request so that you can do anything that you want with your request or response 
app.use('/api', userRouter);
app.use(shortenerRouter);

app.listen(PORT, () => {
    console.log(`Server started at port ${PORT}`);
});