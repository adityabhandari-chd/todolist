const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js");
const mongoose = require("mongoose");
const { Schema } = mongoose;
const _ = require("lodash");

// var items = ["buy", "cook", "eat"];
// const workItems = [];
const app = express();

app.set('view engine', 'ejs');
app.use(express.static("public"));

app.use(bodyParser.urlencoded({ extended: true }));
mongoose.set('strictQuery', true);
//connect mongoose
mongoose.connect('mongodb+srv://admin-aditya:RWpNUHDoPnfjpshF@cluster0.i39ujrp.mongodb.net/todolistDB', { useNewUrlParser: true });
//Schema

const itemsSchema = new mongoose.Schema({

    name: String
});
//model
const Item = mongoose.model("Item", itemsSchema);
//documents

const item1 = new Item({
    name: "Welcome to todolist"
});
const item2 = new Item({
    name: "Welcome to todolist1"
});
const item3 = new Item({
    name: "Welcome to todolist2"
});
//make array
const defaultItems = [item1, item2, item3];
const listSchema = {
    name: String,
    items: [itemsSchema]
};

const List = mongoose.model("List", listSchema);
//insert many 

// Item.insertMany(defaultItems, function(err) {
//     if (err) {
//         console.log(err);
//     } else {
//         console.log("saved default items");
//     }
// });

app.get("/", function(req, res) {

    // var today = new Date();
    // var currentDay = today.getDay();
    // var options = {
    //     weekday: "long",
    //     day: "numeric",
    //     month: "long"
    // };
    // var day = today.toLocaleDateString("en-US", options);
    //const day = date.getDate();


    Item.find({}, function(err, foundItems) {
        if (foundItems.length === 0) {
            Item.insertMany(defaultItems, function(err) {
                if (err) {
                    console.log(err);
                } else {
                    console.log("saved default items");
                }
            });
            res.redirect("/");

        } else {
            console.log(foundItems);
            res.render("list", {
                listTitle: "Today",
                newListItems: foundItems
            });
        }
    });
    //RWpNUHDoPnfjpshF

    app.get("/:customListName", function(req, res) {
        const customListName = _.capitalize(req.params.customListName);
        List.findOne({ name: customListName }, function(err, foundList) {
            if (!err) {
                if (!foundList) {
                    const list = new List({
                        name: customListName,
                        items: defaultItems
                    });
                    list.save();
                    res.redirect("/" + customListName);
                } else {
                    res.render("list", { listTitle: foundList.name, newListItems: foundList.items });
                }
            }
        });


    });
});

app.post("/", function(req, res) {
    console.log(req.body);
    // const item = req.body.newListItems;
    // items.push(item);
    // res.redirect("/");
    const itemName = req.body.newListItems;
    const listName = req.body.list;
    const item = new Item({
        name: itemName
    });

    if (listName === "Today") {



        item.save();
        res.redirect("/");
    } else {
        List.findOne({ name: listName }, function(err, foundList) {
            foundList.items.push(item);
            foundList.save();
            res.redirect("/" + listName);
        })
    }
});



// app.get("/work", function(req, res) {
//     res.render("list", {
//         listTitle: "Work List",
//         newListItems: workItems
//     });
// });
app.get("/about", function(req, res) {
    res.render("about");
});

app.post("/work", function(req, res) {
    const item = req.body.newListItems;
    workItems.push(item);
    res.redirect("/work");
});

app.post("/delete", function(req, res) {
    const checkedItem = req.body.checkbox;
    const listName = req.body.listName;
    if (listName === "Today") {
        Item.findByIdAndRemove(checkedItem, function(err) {
            if (!err) {
                console.log("deleted");
                res.redirect("/");
            }
        });
    } else {
        List.findOneAndUpdate({ name: listName }, { $pull: { items: { _id: checkedItem } } }, function(err, foundList) {
            if (!err) {
                res.redirect("/" + listName);
            }
        });
    }

});

app.listen(3000, function(req, res) {
    console.log("server started");
});