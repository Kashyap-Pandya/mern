import express from "express";
import dotenv from "dotenv";
import connectDB from "./Db/connection.js";
const PORT = process.env.PORT;
import ProductRoutes from "./Routes/ProductRoutes.js";
import cors from "cors";

const app = express();

// middleware

app.use(
  cors({
    origin: "http://localhost:5173",
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

dotenv.config({
  path: "./env",
});

// routes middleware
app.use("/api/products", ProductRoutes);

connectDB();

app.listen(PORT, () => {
  console.log(`Server is running on PORT ${PORT}`);
});
