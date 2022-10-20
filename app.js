const bodyParser = require("body-parser");
const express = require("express");
const app = express();
const routes = require('./routes/routes');
const passport = require("passport");
const session = require("express-session");

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(__dirname + "/public"));

app.use(session({
    secret: "ayyoowhtthehell",
    resave: false,
    saveUninitialized: false
}))

app.use(passport.initialize());
app.use(passport.session());

app.use("/", routes);

let port = process.env.PORT;

if (port == null || port == "") {
    port = 3000;
}

app.listen(port, function () {
    console.log("server has started");
}); 