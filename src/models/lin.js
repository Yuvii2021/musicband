const express = require(`express`);
const mongoose = require(`mongoose`);

const logen = new mongoose.Schema({
    loginemail:{
        type:String,
        required:true,
    },
    otp:{
        type:String,
        trim:true,
        required:true,
    }
})

const Log = new mongoose.model("Log",logen);
module.exports = Log ;