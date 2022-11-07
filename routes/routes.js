const express = require("express");
const todoItem = require("../models/todoItem");
const route = express.Router();
const User = require("../models/auth");
const passport = require("passport");

const todoList = [];
const categoryList = [];

let userID;

route.get('/login', (req, res) => {
    res.render("login");
});

route.get("/delete", (req, res) => {
    req.logout((err) => {
        if (err) {
            console.log(err);
        } else {
            res.redirect('/login');
        }
    });
});

route.get("/register", (req, res) => {
    res.render("register");
});

route.post('/register', (req, res) => {

    console.log(req.body.username);
    console.log(req.body.password);
    User.register({ username: req.body.username }, req.body.password, function (err, user) {
        if (err) {
            console.log(err);
            res.redirect('/login');
        } else {
            passport.authenticate("local")(req, res, function () {
                console.log(user);
                userID = req.user.userID;
                console.log('userID: ', userID);
                res.redirect('/');
            });
        }
    });
});

route.post('/login', (req, res) => {

    const user = new User({
        username: req.body.username,
        password: req.body.password
    })

    req.login(user, function (err, user) {
        if (err) {
            console.log(err);
            res.redirect('/login');
        } else {
            passport.authenticate("local")(req, res, function () {
                userID = req.user.userID;
                console.log('userID: ', userID);
                res.redirect("/");
            });
        }
    });

});

route.get("/", async (req, res) => {

    if (!req.isAuthenticated()) {
        res.render("login");
    } else {

        console.log("current logged in user ", req.user.username, "there userID is ", req.user.userID);

        const items = await todoItem.find({ userID: userID });

        const categories = await todoItem.find({ userID: userID }).select('category');

        const kategorika = [];
        categories.forEach((element) => {
            if (!kategorika.includes(element.category)) {
                kategorika.push(element.category);
            }
        })

        res.render("home", { todo: items, category: kategorika, showlist: false });

    }

});

route.get("/category/:id", async (req, res) => {

    if (!req.isAuthenticated()) {
        res.redirect("/login");
    }

    const categoryItem = req.params.id;
    // const categoryItems = await todoItem.find({ userID: userID });
    const items = await todoItem.find({ userID: userID, category: categoryItem });
    console.log(items)

    items.shift();

    const categories = await todoItem.find({ userID: userID }).select('category');


    const kategorika = [];

    categories.forEach((element) => {
        if (!kategorika.includes(element.category)) {
            kategorika.push(element.category);
        }
    })

    res.render("home", { todo: items, category: kategorika, showlist: true, title: categoryItem });
});

route.post("/category", function (req, res) {

    console.log(req.user.userID);

    const newCategory = req.body.category;

    const mongoItem = new todoItem({
        id: Date.now() + Math.random(),
        name: newCategory,
        category: newCategory,
        userID: req.user.userID,
    });

    mongoItem.save().then(() => {
        res.redirect("/category/" + newCategory);
    });

});

route.post("/switchcategory", function (req, res) {
    const categoryName = req.body.cat;
    res.redirect('/category/' + categoryName)
});

route.post("/", function (req, res) {
    const itemName = req.body.item;
    let cat = req.body.cat;
    const category = cat.replace(/^\s+|\s+$/gm, '');

    const item = {
        id: Date.now() + Math.random(),
        itemName,
        category
    }

    todoList.push(item);

    const mongoItem = new todoItem({
        id: Date.now() + Math.random(),
        name: itemName,
        category: category,
        userID: req.user.userID,
    })

    mongoItem.save().then(() => {
        res.redirect("/category/" + category);
    });

})

route.post('/delete', async (req, res) => {
    let deleteItem = req.body.deleteItem.replace(/\s/g, "");

    const deleteId = await todoItem.findOne({ id: deleteItem });
    console.log(deleteId);


    todoItem.findOneAndDelete({ id: deleteItem }, function (err, doc) {
        if (err) {
            console.log(err);
        } else {
            const category = doc.category;
            res.redirect('/category/' + category);
        }
    })

})

route.post('/edit', async function (req, res) {

    const updatedItem = req.body.edited;
    const itemId = req.body.update.replace(/\s/g, "");

    console.log(itemId);
    console.log(updatedItem);

    todoItem.findOneAndUpdate({ id: itemId }, { name: updatedItem }, null, (err, docs) => {
        if (err) {
            console.log(err);
        }
        console.log('data updated successfully');
        console.log(docs);
        res.redirect('/category/' + docs.category);
    })

})

route.post('/deleteCategory', (req, res) => {

    const deleteCat = req.body.categoryTitle.replace(/\s/g, "");
    console.log("category to delete: ", deleteCat);

    todoItem.findOneAndDelete({ category: deleteCat }, function (err, doc) {
        if (err) {
            console.log(err);
        } else {
            console.log(doc);
            res.redirect('/');
        }
    })

})

module.exports = route;