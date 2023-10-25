const Sequelize=require('sequelize');
const sequelize = require('../util/util')

  const Account=sequelize.define('account',{
    ID :{
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        
        autoIncrement:true,
    },
    Email :{
        type: Sequelize.STRING,
        allowNull: false,
        
        unique: true,
    },
    USERNAME :{
        type: Sequelize.STRING,
        allowNull: false,
        
    },
    
    PASSWORD :{
        type: Sequelize.STRING,
        allowNull: false,
        
    },
    TotalExpense:{
         type : Sequelize.INTEGER,
         defaultValue: 0,
    },
    ispremium: {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    }
  },
)
  sequelize.sync()
  .then(() => {
    console.log('sync succesfully');
    
  }).catch((err) => {
    console.log(err);
  });
  
  module.exports=Account