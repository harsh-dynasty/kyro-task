require("dotenv").config();
const express = require("express");
const app = express();

const port = process.env.PORT || 4000;

var cors = require("cors");
const path = require("path");
app.use("/", express.static(path.join(__dirname, "build")));
app.use(
  cors({
    credentials: true,
    origin: function (origin, callback) {
      callback(null, true);
    },
  })
);

app.use(express.json());

const { UserModel } = require("./schema/model");
const mongoose = require("mongoose");
app.listen(port, () => {
  console.log(`Server running at port ${port}`);
});

mongoose
  .connect(process.env.MONGO_URI)
  .then((res) => console.log("MongoDb connected"));

//middleware to verify access token which can be extracted from cookies sent by client
// can use cookie-parser node library
const verifyAccessToken = (req, res, next) => {
  if (true) next();
};

//create a new user
app.post("/user", verifyAccessToken, (req, res) => {
  const user = req.body;

  let Newuser = new UserModel(user);
  UserModel.collection
    .insertOne(Newuser)
    .then((data) => {
      res.json({ mssg: "Success" });
    })
    .catch((err) => {
      console.log(err);
      res.status(400).send("Status: Bad Request");
    });
});

//get user by id
app.get("/user/:id", verifyAccessToken, (req, res) => {
  const { id } = req.params;
  console.log(id);
  UserModel.findOne({ _id: id })
    .then((user) => {
      res.json({ mssg: "Success", user });
    })
    .catch((err) => {
      console.log(err);
      res.sendStatus(404);
    });
});

//update user by id
//in request body we'll pass obj containing key value pairs which has to be modified
app.put("/user/:id", verifyAccessToken, (req, res) => {
  const { id } = req.params;
  const filter = { _id: id };
  const options = { upsert: false }; //do not create a new doc if not found
  const updateDoc = {
    $set: req.body,
  };
  UserModel.updateOne(filter, updateDoc, options)
    .then((status) => {
      res.json({ mssg: "Success" });
    })
    .catch((err) => {
      console.log(err);
      res.sendStatus(404);
    });
});
