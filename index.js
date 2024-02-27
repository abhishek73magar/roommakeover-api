require("dotenv").config();
require("./db");
const express = require("express");
const app = express();
const cors = require("cors");
//const server = http.createServer(server);
const cookieParser = require("cookie-parser");
const { auth } = require("./libs/auth");
const origins = require("./config/origins");
const { checkAdminUser } = require("./model/admin/adminAuthModel");
const adminAuth = require("./libs/adminAuth");
checkAdminUser()

const port = process.env.PORT;
// console.log(corsList.split(","));

app.use(cookieParser());
app.use(express.json());

app.use("/api/image", express.static("public"));
app.use(cors({ origin: origins, credentials: true }));
// app.use(auth);
app.use((req, res, next) => { console.log(req.method, "-", req.url, "-", new Date().toISOString()); return next()})
app.use('/api/admin', adminAuth, require("./router/adminRouter"))
app.use("/api", auth, require("./router/router"));


app.listen(port, () => console.log(`Server Start at ${port}`));
