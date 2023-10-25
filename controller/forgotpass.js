
const path=require('path')
const uuid=require('uuid')
const bcrypt=require('bcrypt')
const Sib=require('sib-api-v3-sdk')
require('dotenv').config();



const defaultClient = Sib.ApiClient.instance;
const apiKey = defaultClient.authentications['api-key'];
apiKey.apiKey = process.env.API_KEY;
const apiInstance = new Sib.TransactionalEmailsApi();

const ForgotPasswordRequest=require('../models/forgatpassword')
const Account=require('../models/User');
const { error } = require('console');

module.exports.ForgotPage=(req,res)=>{
    console.log(process.env.API_KEY)
    res.sendFile(path.join(__dirname,'../','Views','forgotpassword.html'))
}
//------------------------------------------------------------------------------

module.exports.PostForgotPassword=async(req,res)=>{
    const Email=req.body.email;
   const data= await Account.findOne({where:{Email}})

if(data)
{  
     try{ const uuidToken=uuid.v4();
     await ForgotPasswordRequest.create({
        UUID:uuidToken,
        isActive:true,
        accountID:data.ID,
 })
    const sendSmtpEmail = {
        sender: { email: 'mayurjungari2606@gmail.com',name:'MJ pvt LTD' },
        to: [{ email: Email }],
        subject: 'PASSWORD RESET REQUEST',
        htmlContent: `Click the following link to reset your password: <a href="${process.env.WEBSITE}/resetPage/${uuidToken}">Reset Password Link</a>`,
      };
      apiInstance.sendTransacEmail(sendSmtpEmail)
      .then((data) => {
        console.log('Email sent successfully!');
        res.status(200).json({message :"Email sent succesfully"})
      })}
      catch(error) {
        console.error('Error sending email:', error);
        res.status(500).json({ 'error': error,message:'Email cannot be send'})
      };}

else{
     res.status(404).json({message:'used registered Email'})
}
    }

//----------------------------------------
module.exports.Resetpage=(req,res)=>{
    const id=req.params.uuid;
    
    res.send(`<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link rel="stylesheet" href="/CSS/passReset.css">
    </head>
    <body>
        <div class="container">
            <form class="signin-form" method="post" onsubmit="resetPassword(event)">
                <h2>Reset Password</h2>
                <p>Please enter your new password and confirm the reset by clicking the button below.</p>
                <input type="password" placeholder="New Password" required id="newPassword">
                <button type="submit">Reset Password</button>
                <p>Remember your password? <a href="/">Sign in</a></p>
            </form>
        </div>
        <script src="https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js"></script>
        <script>
        
            function resetPassword(event) {
                event.preventDefault();
                const newPassword = document.getElementById('newPassword').value;
                if (!newPassword) {
                    alert('Please enter a new password');
                    return;
                }
                axios.post('/resetpassword/${id}', { newPassword: newPassword })
                    .then((response) => {
                        console.log(response.data);
                        if(response.status==200) window.location.href='${process.env.WEBSITE}'
                    })
                    .catch((error) => {
                        console.error(error);
                    });
            }
        </script>
    </body>
    </html>
    `)
}


module.exports.UpdatePassword= async (req,res)=>{
    const {newPassword}=req.body;
   
    const{uuid}=req.params;
    const resetRequest=await ForgotPasswordRequest.findOne({where:{UUID:uuid}})  
    if(resetRequest.isActive)
    {
        bcrypt.hash(newPassword,10,async(err,hash)=>{  //hashing password
            if(err)
            {
                console.error('error hashing password ',err);
                res.status(500).json({
                    success:false,
                    message:'error in updating password from hashing'
                })
            }
            else
            {
              const user= await Account.findOne({where:{   //updating password
                    ID:resetRequest.accountID,
                }})
                if(user) { user.PASSWORD=hash}
                await user.save();

                resetRequest.isActive=false;  //making reset request invalid
                await resetRequest.save();

                res.status(200).json({
                    sucess: true,
                    message : 'password update succesfull'
                })

                

            }
        })

    }
    else{
        res.status(404).json({message:"Invalid Link"})
    }


}