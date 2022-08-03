const express = require(`express`);
const mongoose = require(`mongoose`);

const cookSchema = new mongoose.Schema({
    names:{
        type:String,
        required:true,
    },
    srcc:{
        type:String,
        required:true,
        trim:true,
    },
    date: {
        type: String,
      },
    message:{
        type:String,
        required:true,
        trim:true,
    },

})

const Tourr = new mongoose.model("Tourr",cookSchema);
module.exports = Tourr ;