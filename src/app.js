const express= require(`express`);
const path=require(`path`);
const hbs=require(`hbs`);
const app= express();
const emailValidator = require('deep-email-validator');
const port= process.env.PORT|| 3000;
require("../db/conn");
const Booking = require("./models/bought")
const Messsage = require("./models/mess")
const Tourr = require("./models/tourr")
const Log = require("./models/lin");
const {registerHelper }= require('hbs');
const { count } = require('console');
const nodemailer = require('nodemailer');
const date = new Date();
const jwt = require("jsonwebtoken");
const cookieparser = require("cookie-parser");
const authh =require("./middleware/auth");
const session = require('express-session')

const static_path=path.join(__dirname,"../public");
const tempalte_path=path.join(__dirname,"../template/views");
app.set('view engine','hbs');
app.set('views',tempalte_path);
app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use( cookieparser());


async function isEmailValid(email) {
    return emailValidator.validate(email)
  }

app.use(express.static(static_path));
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'yuvrana7777@gmail.com',
      pass: 'nlurdrsjofwcopkh',
    }
  });

async function sendverificationemail(email) {
    try{
global.ootp= `${Math.floor(1000+Math.random()*9000)}`;
console.log(ootp)
const loglog= new Log({
    loginemail: email,
    otp: ootp,
 })
 var mailOptions = {
    from: 'yuvrana7777@gmail.com',
    to: email,
    subject: 'Email for verification',
    text: `your otp for login is ${ootp}`,
  };
  
 transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
 loglog.save();

return

    }catch(e){
        res.status(400).send("wrong");
    }
  }

app.get("/",(req,res)=>{
    
    res.render('login');
})
app.post("/",async(req,res)=>{
    try{
        const {valid, reason, validators} = await isEmailValid(req.body.loginemail);
        res.cookie("lemail",req.body.loginemail,{
            httpOnly:true,
            expires: new Date(Date.now()+3000000),
        });
        console.log("yes");
           await sendverificationemail(req.body.loginemail);
       
         return res.status(201).redirect('/otp');
        }
      catch(e){
        res.status(400).send(e);
    }
})


app.get("/front", authh ,(req,res)=>{
    
    res.render('front')
})


app.get("/otp",async(req,res)=>{
        res.render('otp')    
})
app.post("/otp",async(req,res)=>{
    try{
        const token =await jwt.sign({email:req.cookies.lemail},"thenameisgodyouremeberifyounotthengodnotgoonaforgiveyou");
        const veify = await jwt.verify(token,"thenameisgodyouremeberifyounotthengodnotgoonaforgiveyou");
        res.cookie("jwt",token,{
            httpOnly:true,
            expires: new Date(Date.now()+3000000),
        });
        console.log("happy");
        console.log(req.body.code);
        if(ootp===req.body.code){
            const result = await Log.deleteOne({ loginemail: req.cookies.lemail });
            console.log(result);
            return res.status(201).redirect('/front');
        }
        return res.status(400).send("wrong otp")

    } catch(e){
        res.status(400).send(e);
    }
})





// Function to convert
// single digit input
// to two digits
const formatData = (input) => {
    if (input > 9) {
      return input;
    } else return `0${input}`;
  };
    
  // Function to convert
  // 24 Hour to 12 Hour clock
  const formatHour = (input) => {
    if (input > 12) {
      return input - 12;
    }
    return input;
  };
    



app.get("/buy", authh ,(req,res)=>{
    res.render('buy')
})
app.post("/buy", async(req,res)=>{
    try{
        console.log(req.body.ticket);
        const {valid, reason, validators} = await isEmailValid(req.body.email);
        
        
  const format = {
    dd: formatData(date.getDate()),
    mm: formatData(date.getMonth() + 1),
    yyyy: date.getFullYear(),
    HH: formatData(date.getHours()),
    hh: formatData(formatHour(date.getHours())),
    MM: formatData(date.getMinutes()),
    SS: formatData(date.getSeconds()),
  };

        if (valid){
        const myguy= new Booking({
            ticket : req.body.ticket,
            email: req.body.email,
            date: `${format.mm}/${format.dd}/${format.yyyy}`,
            times: `${format.HH}:${format.MM}:${format.SS}`,
         })
         myguy.save();
         var mailOptions = {
            from: 'yuvrana7777@gmail.com',
            to: req.body.email,
            subject: 'booking tickets',
            text: `to pay please click on the link ${req.body.ticket}`,
          };
          
         transporter.sendMail(mailOptions, function(error, info){
            if (error) {
              console.log(error);
            } else {
              console.log('Email sent: ' + info.response);
            }
          });
         return res.status(201).redirect('/tour');
        }
         return res.status(400).send({
            message: "Please provide a valid email address.",
            reason: validators[reason].reason
          })

    } catch(e){
        console.log("error");
        res.status(400).send(e);
    }
})









app.get("/booking", authh ,async(req,res)=>{
    Booking.find({ email: req.cookies.lemail }).sort({"date":-1, "times":-1}).then((Bookings) => {
        var arrayOflogs = [];
     Bookings.forEach(function(element){
       arrayOflogs.push(element);
      });
    res.render('booking', {Bookings: arrayOflogs})
});
})


app.get("/tour", authh ,(req,res)=>{
    Tourr.find({}).then((Tourrs) => {
        var arrayOftour = [];
     Tourrs.forEach(function(element){
       arrayOftour.push(element);
      });
    res.render('tour',{Tourrs: arrayOftour})
});
})


app.get("/logout", authh ,(req,res)=>{
    res.render('logout');
})
app.post("/logout", async(req,res)=>{
    try{
        res.clearCookie("jwt");
        res.clearCookie("lemail");
        return res.status(200).redirect("/");
    } catch(e){
        res.status(400).send(e);
    }
})


app.get("/contact", authh ,(req,res)=>{
    res.render('contact')
})


app.post("/contact", async(req,res)=>{
    try{
        const newmsg = new Messsage({
            firstname : req.body.firstname,
            message: req.body.message, 
            email: req.cookies.lemail,
         })
         console.log()
         newmsg.save();
         return res.status(201).render('contact');
        }catch(e){
        res.status(400).send(e);
    }
})

app.get("*",(req,res)=>{
    res.render('404error')
})
app.listen(port,()=>{
    console.log(`listen ${port}`) 
})