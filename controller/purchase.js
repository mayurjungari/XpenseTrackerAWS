const Order=require('../models/order')
const Account=require('../models/User')
require('dotenv').config();

const jwt=require('jsonwebtoken')
const Razorpay = require('razorpay');
const { stack } = require('../Route/user');
module.exports.purchasePremium=async (req, res) => {
    try {
        const rzp = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET,
        });

        const amount = 249;
        rzp.orders.create({ amount, currency: "INR" }, async (err, order) => {
            if (err) {
                throw new Error(JSON.stringify(err));
            }
            const saveOrder=await Order.create({
                orderId:order.id,
                status:'PENDING',
                accountID:req.user.ID,


            })
                .then(() => {
                    return res.status(201).json({order});
                })
                .catch(err => {
                    throw new Error(err);
                });
        });

    } catch (error) {
        console.log(error);
        res.status(403).json({ message: 'Something went wrong', error: error });
    }
}
//-----------------------------------
module.exports.updateMembership=async (req, res) => {
    try {
      const { order_id, payment_id,status } = req.body;
      if (status === 'Success') {
        await Account.update({ ispremium: true }, { where: { ID: req.user.ID } });
      }
      //--------genratine new token to fix  refresh bugg
    const tokenUpdate=await Account.findOne({where:{ID:req.user.ID}})
      const tokenObject={
        ID:tokenUpdate.ID,
        isPremium:tokenUpdate.ispremium,
        userName:tokenUpdate.USERNAME,
        email:tokenUpdate.Email,
        
      }
      const token=jwt.sign(tokenObject,'Mayur@123')

      //----------------------------------------------
      
  
      
      const orderData = await Order.findOne({ where: { orderId: order_id } });
  
      if (orderData) {
        
       await orderData.update({ paymentId: payment_id,status:status })
  
        res.status(200).json({ message: 'payment status updated successfully','token':token });
      } else {
        res.status(404).json({ message: 'Order not found' });
      }
    } catch (error) {
      console.error('Error:', error);
      res.status(500).send('Internal Server Error');
    }
  }