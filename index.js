require("dotenv").config({ path: ".env"});
require("./db");
require('./middleware/passport')
const express = require("express");
const app = express();
const cors = require("cors");
//const server = http.createServer(server);
const cookieParser = require("cookie-parser");
const { auth } = require("./middleware/auth");
const origins = require("./config/origins");
const { checkAdminUser } = require("./model/admin/adminAuthModel");
const adminAuth = require("./middleware/adminAuth");
const { PORT, SECRETKEY } = require("./config/config");
const session = require("express-session");
const passport = require("passport");
// checkAdminUser()

// console.log(corsList.split(","));
app.use(session({
  secret: SECRETKEY,
  resave: false,
  saveUninitialized: true
}))
app.use(passport.initialize())
app.use(passport.session())

app.use(cookieParser());
app.use(express.json());

app.use('/', express.static('dist'))
app.use("/api/image", express.static("public"));
app.use(cors({ origin: origins, credentials: true }));
// app.use(auth);
app.use((req, res, next) => { console.log(req.method, "-", req.url.split('?')[0], "-", new Date().toISOString()); return next()})
app.use('/api', require('./router/passportRouter'))
app.use('/api/admin', adminAuth, require("./router/adminRouter"))
app.use("/api", auth, require("./router/router"));
app.use('/api/payment', require('./router/paymentGatewayRouter'))


app.listen(PORT, () => console.log(`Server Start at ${PORT}`));
