var express = require('express');
var router = express.Router();
var dotenv=require('dotenv').config();
const mongodb=require('mongodb');
const url=process.env.URL
const mongoClient=mongodb.MongoClient;
const bcryptjs=require("bcryptjs")
const jwt=require("jsonwebtoken");
const SECRET = process.env.JWTsecretKey
const {auth}=require("../bin/Auth")

/* GET home page. */
router.get('/', function(req, res, next) {
  res.send('Welcome to Zen Event Management');
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

        const token = jwt.sign({ _id: user._id,typeofUser:user.typeOfUser }, SECRET);
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

router.post("/capstonetasks", async function (req, res) {
  try {
    const connection = await mongoClient.connect(url);

    const db = connection.db("zenEvent");

    req.body.userid = mongodb.ObjectId(req.userid);

    await db.collection("capstoneTasks").insertOne(req.body);

    await connection.close();

    res.json({
      message: "Capstone Task added sucessfully",
    });
  } catch (error) {
    console.log(error);
  }
});

router.post("/hackathontasks", async function (req, res) {
  try {
    const connection = await mongoClient.connect(url);

    const db = connection.db("zenEvent");

    req.body.userid = mongodb.ObjectId(req.userid);

    await db.collection("hackathonTasks").insertOne(req.body);

    await connection.close();

    res.json({
      message: " Hackathon Task added sucessfully",
    });
  } catch (error) {
    console.log(error);
  }
});

router.get("/capstonetasks", async function (req, res) {
  try {
    const connection = await mongoClient.connect(url);

    const db = connection.db("zenEvent");

    let capstonetask = await db.collection("capstoneTasks").find().toArray();

    await connection.close();

    res.json(capstonetask);
  } catch (error) {
    console.log(error);
  }
});

router.get("/hackathontasks", async function (req, res) {
  try {
    const connection = await mongoClient.connect(url);

    const db = connection.db("zenEvent");

    let hackathontask = await db.collection("hackathonTasks").find().toArray();

    await connection.close();

    res.json(hackathontask);
  } catch (error) {
    console.log(error);
  }
});

router.post("/hackathonsubmission", async function (req, res) {
  try {
    const connection = await mongoClient.connect(url);

    const db = connection.db("zenEvent");

    req.body.userid = mongodb.ObjectId(req.userid);

    await db.collection("hackathonSubmission").insertOne(req.body);

    await connection.close();

    res.json({
      message: " Hackathon submitted sucessfully",
    });
  } catch (error) {
    console.log(error);
  }
});

router.post("/capstonesubmission", async function (req, res) {
  try {
    const connection = await mongoClient.connect(url);

    const db = connection.db("zenEvent");

    req.body.userid = mongodb.ObjectId(req.userid);

    await db.collection("capstoneSubmission").insertOne(req.body);

    await connection.close();

    res.json({
      message: " Capstone submitted sucessfully",
    });
  } catch (error) {
    console.log(error);
  }
});



module.exports = router;
