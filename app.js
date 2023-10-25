const express=require('express')
const app=express();
require('dotenv').config();
const cors=require('cors')
app.use(cors()); 
const path=require('path')
require('dotenv').config();
const bodyparser=require('body-parser')
app.use(bodyparser.urlencoded({extended:false}))
app.use(express.static(path.join(__dirname, 'Public')));
app.use(express.json());
//---------------------------------------
const Razorpay = require('razorpay');

//------------------------------------------------------------

const Sequelize=require('sequelize');
const sequelize = require('./util/util')

const userroute=require('./Route/user')
const expenseroute=require('./Route/Expense')
const purchaseroute=require('./Route/purchase')
const leaderboardRoute=require('./Route/leaderboardRoute')
const reportRoute=require('./Route/report')


 
const Account=require('./models/User')
const Xtable=require('./models/expense')
const Order=require('./models/order')
const ForgotPasswordRequest=require('./models/forgatpassword')



Account.hasMany(Xtable);
Xtable.belongsTo(Account);

Account.hasMany(Order);
Order.belongsTo(Account);

Account.hasMany(ForgotPasswordRequest);
ForgotPasswordRequest.belongsTo(Account);





app.get('/user',userroute)
app.post('/signup',userroute)
app.get('/',userroute)
app.post('/signin', userroute)

app.get('/expense',expenseroute)
   
app.post('/expense/savedata', expenseroute);

app.get('/expense/allData',expenseroute);



app.delete('/expense/deleteData/:id', expenseroute);
app.get('/purchase/premiummembership',purchaseroute)



app.post('/purchase/premiummembership/updatestatus',purchaseroute)

app.get('/showLeaderBoard',leaderboardRoute)




app.get('/purchase/leaderBoard',leaderboardRoute)
app.get('/forgotpass',userroute)
app.post('/password/forgotpassword',userroute)
app.get('/download',reportRoute)
app.get('/resetPage/:uuid',userroute)
app.post('/resetpassword/:uuid',userroute)




app.use((req,res)=>{
    res.send('not found')
})

sequelize.sync()
  .then(() => {
    console.log(' tables have been synchronized!');
  })
  .catch((error) => {
    console.error('Error synchronizing the database:', error);
  });


app.listen(process.env.PORT,()=>{
    console.log('is running in port 8000')
})