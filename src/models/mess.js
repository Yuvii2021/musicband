const express = require(`express`);
const mongoose = require(`mongoose`);

const messa = new mongoose.Schema({
    firstname:{
        type:String,
        required:true,
        trim:true,
    },
    message:{
        type:String,
        required:true,
        trim:true,
    },
    email:{
        type:String,
        required:true,
    },
})

const Messsage = new mongoose.model("Messsage",messa);
module.exports = Messsage ;