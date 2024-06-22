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

//Main get method to render all the list elements 
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

//Whenever we enter a new item, data comes here and it is added to database
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

//Whenever the checkbox is chosen, it update that objects attribute "check" to on, this is needed to "delete all checked"
app.post("/check", function(req,res){
    const CheckedItemId= req.body.checkbox;
    async function checkItem(){
        try{
            // console.log(CheckedItemId)
            // when on we get a list of id repeated twice, when off, we simply get id
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

//Whenever the pen icon is pressed, the data of that field comes here and i already placed as a default into the text field as prefix
app.post("/edit", function(req,res){
    const editid=req.body.editor;
    async function name(){
        try{
            const prefix= await Item.findOne({_id:editid})
            res.render("editfield", {Id:editid, prefix:prefix.name})
        }
        catch{
            console.log("Cant find prefix")
        }
    }
    name()
})
//The new prefix+newValue is sent here to update it in database
app.post("/updateedit", function(req,res){
    const newValue=req.body.newItem
    const Id=req.body.editorId
    async function updateedit(){
        try{
            await Item.updateOne({_id:Id},{name:newValue})
            res.redirect("/");
        }
        catch{
            console.log("Cant Update")
        }
    }
    updateedit()
})

//Whenever the delete checked is pressed, this deleteMany will find all check:on attribute and delete them
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
