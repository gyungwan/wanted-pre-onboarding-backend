import dotenv from "dotenv";
import express from "express";
import userRouter from "./src/routes/userRoutes.js";
import boardRoutes from "./src/routes/boardRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT ?? 3000;

app.use(express.json());

app.use("/users", userRouter);
app.use("/boards", boardRoutes);
app.use(express.urlencoded({ extended: true }));
app.get("/", (req, res) => {
  res.send("Hello, world");
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
