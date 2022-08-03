const express = require(`express`);
const mongoose = require(`mongoose`);

const bookSchema = new mongoose.Schema({
    email:{
        type:String,
        required:true,
    },
    ticket:{
        type:Number,
        required:true,
        trim:true,
    },
    date: {
        type: String,
      },
    times:{
        type:String,
        required:true,
        trim:true,
    },

})

const Booking = new mongoose.model("Booking",bookSchema);
module.exports = Booking ;