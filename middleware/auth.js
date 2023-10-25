const Account=require('../models/User')
const jwt=require('jsonwebtoken')

module.exports.authenticate=(req,res,next)=>{
    try {
        const token =req.header('Authorization');
        
        const tokenobject=jwt.verify(token,'Mayur@123')
        
        Account.findByPk(tokenobject.ID).then(user=>{
           
            req.user=user;
            next();
        })

        
    } catch (error) {
        console.log(error)
        return res.status(401).json({success :false})
         
    }
}

