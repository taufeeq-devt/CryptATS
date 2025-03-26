const jwt =require('jsonwebtoken');
const JWT_secret_string='shhhhh';
const fetchuser=(req,res,next)=>{
    const token=req.header('Authorization');
    if(!token){
        res.sendStatus(401).send({error: "User Not Found!!"});
    }
    const data=jwt.verify(token,JWT_secret_string);
    req.user=data.user;
    next();
}
module.exports=fetchuser;