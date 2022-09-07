var express = require('express');
var router = express.Router();
var dotenv=require('dotenv').config();
const mongodb=require('mongodb');
// const url="mongodb+srv://zenEvent:zen123@cluster0.esyrlnn.mongodb.net"
const url=process.env.URL
const mongoClient=mongodb.MongoClient;
const bcryptjs=require("bcryptjs")
const jwt=require("jsonwebtoken");
const SECRET = process.env.JWTsecretKey


/* GET home page. */
router.get('/', function(req, res, next) {
  res.send('welcome to Zen Event Management');
});

router.post("/register", async function (req, res) {
  try {
    const connection = await mongoClient.connect(url);

    const db = connection.db("zenEvent");

    const salt = await bcryptjs.genSalt(10);
    const hash = await bcryptjs.hash(req.body.password, salt);
    req.body.password = hash;

    await db.collection("users").insertOne(req.body);

    await connection.close();

    res.json({
      message: "Registerd sucessfully",
    });
  } catch (error) {
    console.log(error);
  }
});

router.post("/login", async function (req, res) {
  try {
    const connection = await mongoClient.connect(url);

    const db = connection.db("zenEvent");

    const user = await db
      .collection("users")
      .findOne({ email: req.body.email });
    if (user) {
      const match = await bcryptjs.compare(req.body.password, user.password);
      if (match) {
        //Token

        const token = jwt.sign({ _id: user._id }, SECRET);
        console.log(token);

        res.json({
          message: "Sucessfully logged in",
          token,
        });
      } else {
        res.status(401).json({
          message: "password incorrect",
        });
      }
    } else {
      res.status(401).json({
        message: "user not found",
      });
    }
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
