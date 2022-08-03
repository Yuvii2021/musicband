const jwt=require("jsonwebtoken");

const authh =async(req ,res,next)=>{
    try{
        const token =req.cookies.jwt;
        const veify = await jwt.verify(token,"thenameisgodyouremeberifyounotthengodnotgoonaforgiveyou");
        req.token=token;
        next();
    }
    catch(e){

        res.status(401).redirect("/");
    }

}
module.exports = authh;

