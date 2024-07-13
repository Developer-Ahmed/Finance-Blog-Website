const express = require("express");
const app = express();
const mainRoute = require("./routes/index");
const mongoose = require("mongoose");

const adminUser = require("./schemas/adminUser");

app.use(express.urlencoded({ limit: '10mb', extended: true }));

const helmet = require("helmet");
app.use(helmet({ contentSecurityPolicy: false }));

const RateLimit = require("express-rate-limit");
const limiter = RateLimit({
  windowMs: 15*60*1000, // 15 minutes
  max: 100, // limit of number of requests per ip
  delayMs: 0 // disables delays
});

// public 
app.use(express.static('public'));
app.use('/css', express.static(__dirname + 'public/css'));
app.use('/js', express.static(__dirname + 'public/js'));
app.use('/images', express.static(__dirname + 'public/images'));

const { uri, keys_list } = require("./secret")

// mongodb 
mongoose.connect(uri);

const ejs = require("ejs");

// auth
const session = require("cookie-session");
const bcrypt = require("bcrypt");

app.use(
    session({
      name: 'session',
      keys: keys_list,
      resave: false,
      saveUninitialized: true,
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    })
);

app.use(async (req, res, next) => {
    console.log(req.session.userId);
    if (!req.session.userId) return next();
    const user = await adminUser.findById(req.session.userId);
    if (!user) {
      req.session.userId = null;
      return next();
    }
    req.user = user;
    res.locals.user = user;
    req.user.name = user.username;
    return next();
});

app.set("view engine", "ejs");

const port = 3000;

app.use("/", mainRoute);

app.listen(port, () => {
  console.log(`The app is running on port ${port}!`);
});
