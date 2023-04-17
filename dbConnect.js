const Mongoose = require("mongoose");
const uri = "mongodb://127.0.0.1:27017/capStone";

const mongooseOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

Mongoose.connect(uri, mongooseOptions)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(`MongoDB connection error` + error.message));

const db = Mongoose.connection;

db.on("error", console.error.bind(console, "MongoDB connection error:"));

exports.Mongoose = Mongoose;
