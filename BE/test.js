const express = require("express");

const Message = require("./schemas/message");

const app = express();

app.use(express.json());

app.get("/", async (req, res) => {
  const allDogs = await Message.find();
  return res.status(200).json(allDogs);
});
app.listen(5000)