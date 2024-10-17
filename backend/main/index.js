import express from "express";

const app = express();

app.get("/", (req, res) => {
  try {
    return res.status(200).json({ message: "hello world" });
  } catch (error) {
    return res.status(400).json(error);
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log("Server running on port:", PORT);
});
