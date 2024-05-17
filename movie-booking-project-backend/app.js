import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

// Import routes
import userRouter from "./routes/user-routes.js";
import adminRouter from "./routes/admin-routes.js";
import movieRouter from "./routes/movie-routes.js";
import bookingsRouter from "./routes/booking-routes.js";

dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use("/user", userRouter);
app.use("/admin", adminRouter);
app.use("/movie", movieRouter);
app.use("/booking", bookingsRouter);

// Mongoose configuration
mongoose.set('strictQuery', true); // or false based on your preference

mongoose
  .connect(
    `mongodb+srv://hassan:hassan@cluster0.sodnnyw.mongodb.net/yourDatabaseName`, // Replace 'yourDatabaseName' with your actual database name
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() =>
    app.listen(5000, () => console.log("Connected To Database And Server is running"))
  )
  .catch((e) => console.log(e));
