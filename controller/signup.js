const path=require('path')
const Account=require('../models/User')
const bcrypt=require('bcrypt')
const Sequelize=require('sequelize')
const sequelize=require('../util/util')

module.exports.GetSignUp=(req,res)=>{
    res.sendFile(path.join(__dirname,'../','Views','signup.html')) 
}

module.exports.PostSignUp=async (req,res)=>{
  const t= await sequelize.transaction();
    try
     {   const name = req.body.name;
        const email = req.body.email;
        const password = req.body.password;
        const exhistAccount = await Account.findOne({
            where: {
              Email: email
            },transaction:t
          });
        if(!exhistAccount){

           const saltround=10;
           const hashpassword=await bcrypt.hash(password,saltround)




           const newAccount= await Account.create({
                Email:email,
                USERNAME:name,
                PASSWORD:hashpassword,
            },{
              transaction:t,
            })
            await t.commit();
            console.log('Account SignUp succesfully')
            res.status(200).send('signUp Succesfully')
        }
    else {
        console.log('Email Already Exhist')
        res.write("Email already exists");
        res.end();
    
    }
      }
    
      catch (error) {
       await t.rollback();
        console.log(error)
        res.status(500).send('Something Went Wrong')
        
    }
    
    
    }