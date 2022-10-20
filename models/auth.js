const mongoose = require("mongoose");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");

mongoose.connect("mongodb://admin:iqYz3AisJWlkDZVQ@ac-rgymney-shard-00-00.inyokaa.mongodb.net:27017,ac-rgymney-shard-00-01.inyokaa.mongodb.net:27017,ac-rgymney-shard-00-02.inyokaa.mongodb.net:27017/?ssl=true&replicaSet=atlas-1hq1nv-shard-0&authSource=admin&retryWrites=true&w=majority")

const UserSchema = new mongoose.Schema({
    email: String,
    password: String,
    userID: String
})

UserSchema.pre('save', function () {
    this.userID = Date.now() + Math.random();
})

UserSchema.plugin(passportLocalMongoose);

const User = new mongoose.model("User", UserSchema);

passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

module.exports = User;