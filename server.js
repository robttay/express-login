const express = require("express");
const mustacheExpress = require("mustache-express");
const session = require("express-session");
const bodyParser = require("body-parser");
const app = express();
const sessionConfig = require("./sessionConfig");
const port = process.env.PORT || 8000;
var users = [
  {
    username: "pete",
    password: "pete"
  },
  {
    username: "rockybalboa",
    password: "adrian"
  },
  {
    username: "adameden",
    password: "eve"
  }
];

// set view engine
app.engine("mustache", mustacheExpress());
app.set("views", "./public");
app.set("view engine", "mustache");

// middleware
app.use("/", express.static("/public"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session(sessionConfig));

function checkAuth(req, res, next) {
  if (!req.session.user) {
    return res.redirect("/login");
  } else {
    next();
  }
}

// routes
app.get("/", checkAuth, function(req, res) {
  res.render("index", { user: req.session.user });
});

app.get("/login", function(req, res) {
  res.render("login");
});

app.post("/login", function(req, res) {
  if (!req.body || !req.body.username || !req.body.password) {
    console.log("missing data");
    return res.redirect("/login");
  }
  var requestingUser = req.body;
  var userRecord;
  users.forEach(function(item) {
    if (item.username === requestingUser.username) {
      userRecord = item;
    }
  });
  if (!userRecord) {
    console.log("No record");
    return res.redirect("/login");
  }
  if (requestingUser.password === userRecord.password) {
    req.session.user = userRecord;
    return res.redirect("/");
  } else {
    console.log("Wrong password");
    return res.redirect("/login");
  }
});

app.listen(port, function() {
  console.log("Server is running on port: ", port);
});
