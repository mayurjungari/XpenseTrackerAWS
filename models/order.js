
const Sequelize=require('sequelize');
const sequelize = require('../util/util')

  const Order=sequelize.define('order',{
    
        ID: {
            type: Sequelize.INTEGER,
            allowNull: false,
            primaryKey: true,
            unique: true,
            autoIncrement: true,
        },
        

    paymentId :{
        type: Sequelize.STRING,
        
        
    } ,
     orderId :{
        type: Sequelize.STRING,
       
        
    },
    status :{
        type: Sequelize.STRING,
      
        
    },



  })
  sequelize.sync()
  .then(() => {
    console.log('Database synchronized.');
  })
  .catch((error) => {
    console.error('Error synchronizing the database:', error);
  });
  
  module.exports=Order