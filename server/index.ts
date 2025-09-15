import express from "express";
import dotenv from "dotenv";
import connectDb from "./config/db";
import cors from 'cors'
import cookieParser from "cookie-parser";
import authRouter from "./routes/authRoute";
import userRouter from "./routes/userRoute";
import PollRouter from "./routes/PollRoute";

dotenv.config();


const app = express();
const PORT = process.env.PORT || 8000;

connectDb()

// Middleware
app.use(express.json());
app.use(cookieParser())
app.use(cors({
  origin: 'http://localhost:5173', // Allow requests from this origin
  credentials: true, // Allow cookies to be sent
}))


app.use('/api/auth' , authRouter)
app.use('/api/' , PollRouter)

// Start server
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
