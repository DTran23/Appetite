"use strict";

require('dotenv').config();

const PORT        = process.env.PORT || 8080;
const ENV         = process.env.ENV || "development";
const express     = require("express");
const bodyParser  = require("body-parser");
const sass        = require("node-sass-middleware");
const app         = express();
const cookieSession     = require('express-session');
const knexConfig  = require("./knexfile");
const knex        = require("knex")(knexConfig[ENV]);
const morgan      = require('morgan');
const knexLogger  = require('knex-logger');
const MessagingResponse = require('twilio').twiml.MessagingResponse;

// Seperated Routes for each Resource
const usersRoutes = require("./routes/users");
const itemRoutes = require("./routes/items");

const accountSid = 'AC55535e36229687b8c837b28720d4ff35';
const authToken = '6f744798e7d9ab0380a556356c3081a8';
const client = require('twilio')(accountSid, authToken);

const usersDatabase = {
  "Daniel": {
    id: "Daniel1",
    email: "user@example.com",
    password: "pu"
  },
  "Daniel2": {
    id: "Daniel2",
    email: "user@example.com",
    password: "pu"
  }
}

app.use(morgan('dev'));
app.use(knexLogger(knex));
app.use(cookieSession({
  name: 'session',
  secret: 'super secret',
  keys: ['key1', 'key2'],
  maxAge: 24 * 60 * 60 * 1000 // 24 hours
}));
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/styles", sass({
  src: __dirname + "/styles",
  dest: __dirname + "/public/styles",
  debug: true,
  outputStyle: 'expanded'
}));
app.use(express.static("public"));
// Mount all resource routes
app.use("/api/users", usersRoutes(knex));
app.use("/api/items", itemRoutes(knex));

app.set("view engine", "ejs");


const generateRandomString = () => {
  return Math.random().toString(36).substring(2,8);
};


// Home page
app.get("/", (req, res) => {
  const userInfo = { user: req.session.user };
  res.render("index", userInfo);
});

//get for order
app.get("/order", (req, res) => {
  const userInfo = { user: req.session.user };
  res.render("order", userInfo);
});

//get for checkout
app.get("/checkout", (req,res) => {
  const userInfo = { user: req.session.user };
  res.render("checkout", userInfo);
});

//get for registration
app.get("/register", (req, res) => {
  res.render("register");
});

//get for login
app.get("/login", (req, res) => {
  res.render("login");
});

app.get("/checkout/final", (req, res) => {
  res.render("/checkout/final");
});


//post to update
app.post("/order/update", (req, res) => {
  res.redirect("order");
});

// post to chckout on order submit
app.post("/checkout", (req, res) => {
  const msg = client.messages
  res.redirect("/")
  res.json({success: true});
});

app.post("/register", (req, res) => {
  const { email, password } = req.body;
  // Generate new user
  const id = generateRandomString();
  const newUser = {
    id,
    email,
    password
  }
  //Add new user to DB
  usersDatabase[id] = newUser;
  //Set cookie
  req.session.user = newUser;
  res.redirect("/");
})

app.post("/login", (req, res) => {
  res.redirect("/");
});


app.listen(PORT, () => {
  console.log("Example app listening on port " + PORT);
});







