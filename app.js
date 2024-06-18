// i request express bodyparser 
// jshint esversion: 6
// learning gittt
// creating a branch

const express = require("express");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("Public"));
app.set('view engine', 'ejs');

var items = [];
// var items=['Buy Food','Cook Food','Eat Food'];
app.get("/", function (req, res) {
    var today = new Date();
    var options = {
        weekday: 'long',
        day: 'numeric',
        month: 'long'
    };
    var day = today.toLocaleDateString("en-US", options);

    res.render("list", { kindOfDay: day, newListItems: items });
});

// app.get("/del",function(req,res){
//     res.render("delete");
// });

app.post("/", function (req, res) {
    var item = req.body.newItem;
    items.push(item);
    res.status(200).send("Item added successfully!");
});

app.listen(process.env.POST || 3000, function () {
    console.log("Port is Running at 3000");
});
