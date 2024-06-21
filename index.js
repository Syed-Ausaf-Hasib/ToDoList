// i request express bodyparser 
// jshint esversion: 6

const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const mongoose = require("mongoose");

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("Public"));
app.set('view engine', 'ejs');

mongoose.connect("mongodb+srv://AusafHasib:KNAxZ8LH768c@cluster0.aelg0ut.mongodb.net/todolistDB");
const itemsSchema = {
    name: String,
    check: String
};
const Item=mongoose.model("Item", itemsSchema);

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

app.post("/check", function(req,res){
    const CheckedItemId= req.body.checkbox;
    // console.log(CheckedItemId)
    async function checkItem(){
        try{
            // console.log(CheckedItemId)
            if(CheckedItemId.length==2){
                await Item.updateOne({_id:CheckedItemId[0]},{check:"on"})
                // console.log("On")
            }
            else{
                await Item.updateOne({_id:CheckedItemId},{check:"off"})
                // console.log("Off")
            }
            res.redirect("/")
        }
        catch(err){
            console.log("Im stuckkk");
        }
    }
    checkItem();
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

app.listen(process.env.PORT || 3000, function () {
    console.log("Port is Running at 3000");
});
