const mongoose=require(`mongoose`);

mongoose.connect('mongodb://localhost:27017/music').
then(()=>{
    console.log("connection");
}).catch((e)=>{
    console.log("error");
});