import express from "express";
import apiRouter from "./api/index.js";
import bodyParser from "body-parser";
import dotenv from "dotenv";

dotenv.config({ path: "./.env" });

const PORT = process.env.MAIN_SERVICE_PORT || 3000;

const app = express();

app.use(bodyParser.json());

app.get("/", (req, res) => {
  try {
    return res.status(200).json({ message: "hello world" });
  } catch (error) {
    return res.status(400).json(error);
  }
});

app.use("/api", apiRouter);

app.all("*", (req, res) => {
  res.status(404).json({ message: "Not found" });
});

app.listen(PORT, () => {
  console.log("Server running on port:", PORT);
});
