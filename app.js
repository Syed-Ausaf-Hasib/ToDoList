// i request express bodyparser 
// jshint esversion: 6
// learning gittt
// creating a branch

const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const mongoose = require("mongoose");

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("Public"));
app.set('view engine', 'ejs');

mongoose.connect("mongodb://localhost:27017/todolistDB",{useNewUrlParser: true});
const itemsSchema = {
    name: String,
    check: String
};
const Item=mongoose.model("Item", itemsSchema);

// const item1 = new Item({
//     name:"Running"
// });
// const item2 = new Item({
//     name:"Crying"
// });
// const item3 = new Item({
//     name:"Coding"
// });
// const defaultItems = [item1,item2,item3];
// Item.insertMany(defaultItems);

// const items=[];
app.get("/", function (req, res) {
    var today = new Date();
    var options = {
        weekday: 'long',
        day: 'numeric',
        month: 'long'
    };
    var day = today.toLocaleDateString("en-US", options);
    async function finding(){
        try{
            const founditems=await Item.find({});
            res.render("list", { kindOfDay: day, newListItems: founditems });
        }
        catch{
            console.log("Some error occurred!!");
        }
    }
    finding();
});

app.post("/", function (req, res) {
    const itemName = req.body.newItem;
    // items.push(item); coz items array doesnt exist now
    const item = new Item({
        name: itemName,
        check: 'off'
    })
    item.save();
    res.redirect('/');
});

app.post("/delete", function(req,res){
    async function deleteItem(){
        try{
            await Item.deleteMany({check:'on'});
            res.redirect('/');
        }
        catch(err){
            console.log('error in deleting');
        }
    }
    deleteItem();
})

app.listen(process.env.POST || 3000, function () {
    console.log("Port is Running at 3000");
});
