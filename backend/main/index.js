import express from "express";
import UserClient from "./clients/UserClient.js";

const PORT = 3000;

const app = express();

app.get("/", (req, res) => {
  try {
    return res.status(200).json({ message: "hello world" });
  } catch (error) {
    return res.status(400).json(error);
  }
});

app.get("/users", (req, res) => {
  UserClient.getAllUsers(null, (err, data) => {
    if (err) {
      return res.status(400).json(err);
    }
    return res.status(200).json(data);
  });
});

app.get("/users/:id", (req, res) => {
  UserClient.getUser({ id: req.params.id }, (err, data) => {
    if (err) {
      return res.status(400).json(err);
    }
    return res.status(200).json(data);
  });
});

app.listen(PORT, () => {
  console.log("Server running on port:", PORT);
});
