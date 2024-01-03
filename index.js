require("dotenv").config();
require("./db");
const express = require("express");
const app = express();
const cors = require("cors");
//const server = http.createServer(server);
const cookieParser = require("cookie-parser");
const { auth } = require("./libs/auth");
const port = process.env.PORT;
// console.log(corsList.split(","));

app.use(cookieParser());
app.use("/api/image", express.static("public"));
app.use(express.json());


app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:3001",
      "http://localhost:3002",
      "http://localhost:4000",
      "https://online-shop-three-beryl.vercel.app",
      "https://roommakeover.theminiland.com",
      "https://admin.theminiland.com",
      "https://roommakeover.com.np",
      "https://admin.roommakeover.com.np",
      "https://www.roommakeover.com.np",
      "https://alpha.roommakeover.com.np",
      "https://dashboard.roommakeover.com.np",
      "http://dashboard.roommakeover.com.np",
      "http://78.46.201.98:9002",
      "http://78.46.201.98:9000"
    ],
    credentials: true,
  })
);
// app.use(auth);
app.use((req, res, next) => { console.log(req.method, "-", req.url, "-", new Date().toISOString()); return next()})
app.use('/api/admin', require("./router/adminRouter"))
app.use("/api", auth, require("./router/router"));


app.listen(port, () => console.log(`Server Start at ${port}`));
