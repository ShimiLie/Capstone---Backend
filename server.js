const express = require("express");
const app = express();
const port = 5000;

const cors = require("cors");
const dotenv = require("dotenv");
const authRouter = require("./routes/auth/auth"); //call authrouter
const postRouter = require("./routes/posts/posts"); //call postrouter

let dbConnect = require("./dbConnect");

dotenv.config();

app.use(express.json());
app.use(cors());
//call the routes
app.use("/api", authRouter);
app.use("/api", postRouter);

app.get("/", (req, res) => {
  res.write("Hello World!");
  res.end();
});

app.listen(port, () => {
  console.log(`Server is running on ${port}`);
});
