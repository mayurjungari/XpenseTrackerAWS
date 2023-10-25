const path=require('path')
const bcrypt=require('bcrypt')
const Account=require('../models/User')
const jwt=require('jsonwebtoken')
const Sequelize=require('sequelize')
const sequelize=require('../util/util')

//----------------------------------------------------------

module.exports.GetSignIn=(req,res)=>{
    res.sendFile(path.join(__dirname,'../','Views','signin.html')) 
}
//-------------------------------------------------------------

module.exports.PostSignIn=async (req, res) => {
    const { email, password } = req.body;
    const t= await sequelize.transaction();
  
    try {
      const exhistuser = await Account.findOne({ where: { Email: email },transaction:t });
       
      if (exhistuser) {
        const matchpassword= await bcrypt.compare(password,exhistuser.PASSWORD)
        if (matchpassword) {

          const tokenObject={
            ID:exhistuser.ID,
            isPremium:exhistuser.ispremium,
            userName:exhistuser.USERNAME,
            email:exhistuser.Email
           }
           const token=jwt.sign(tokenObject,'Mayur@123')
          //  console.log(token)
          await t.commit();
          res.status(200).send({
            message: 'Sign in successful!',
            token: token
          })
        } else {
          await t.rollback();
          res.status(401).send('Incorrect password');
        }
      } else {
        await t.rollback();
        res.status(404).send('User does not exist');
      }
    } catch (error) {
      await t.rollback();
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
  }