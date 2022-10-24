const express = require("express");
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();
const Kitten = require('./models/kitten');

app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  next();
});

app.get("/", (req, res) => {
    res.send('hello world')
});

app.get("/kittens", async (req, res) => {
  try {
    const kittens = await Kitten.find();
    res.status(200).json({
      kittens
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Failed to load kittens." });
  }
});

app.post("/kittens", async (req, res) => {
  const { name: kittenName } = req.body;

  if (!kittenName || !kittenName.trim()) {
    return res.status(422).json({ message: "Invalid kitten name." });
  }

  const kitten = new Kitten({
    name: kittenName,
  });

  try {
    await kitten.save();
    res
      .status(201)
      .json({ message: "Kitten saved", kitten: { id: kitten.id, name: kittenName } });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Failed to save kitten." });
  }
});

mongoose.connect(`mongodb://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@mongodb:27017/mevn-cats?authSource=admin`, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// 取得資料庫連線狀態
const db = mongoose.connection;
db.on('error', (err) => console.error(err));
db.once('open', () => console.log('successfully connected to mongodb!'));

app.listen(3000);