require("dotenv").config();
require("./db");
const express = require("express");
const app = express();
const cors = require("cors");
const http = require("http");
const corsList = process.env.urlList || [];
//const server = http.createServer(server);
const cookieParser = require("cookie-parser");
const { auth } = require("./libs/auth");
const port = process.env.PORT;
// console.log(corsList.split(","));

app.use(cookieParser());
app.use(express.static("public"));
app.use(express.json());

const corsOptions = {
  origin: [
    "http://localhost:3000",
    "http://localhost:3001",
    "http://localhost:3002",
    "http://localhost:4000",
    "https://online-shop-three-beryl.vercel.app",
    "https://roommakeover.theminiland.com",
  ],
  credentials: true,
}

app.use(cors(corsOptions));
app.use(auth);
app.use("/api", require("./router"));

app.listen(port, () => console.log(`Server Start at ${port}`));
