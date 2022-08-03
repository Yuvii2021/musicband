const express = require(`express`);
const mongoose = require(`mongoose`);

const Cod = new mongoose.Schema({
    otp:{
        type:String,
        trim:true,
        required:true,
    }
})

const Log = new mongoose.model("Log",logen);
module.exports = Log ;