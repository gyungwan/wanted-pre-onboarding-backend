import dotenv from "dotenv";
import express from "express";
import userRouter from "./src/routes/userRoutes.js";

dotenv.config();

const app = express();
const port = 3000;

app.use(express.json());

app.use("/user", userRouter);
app.use(express.urlencoded({ extended: true }));
app.get("/", (req, res) => {
  res.send("Hello, world");
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});