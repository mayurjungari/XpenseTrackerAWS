const Sequelize=require('sequelize');
const sequelize = require('../util/util')

  const Xtable=sequelize.define('Xtable',{
    
        ID: {
            type: Sequelize.INTEGER,
            allowNull: false,
            primaryKey: true,
            unique: true,
            autoIncrement: true,
        },
        

    CATEGORY :{
        type: Sequelize.STRING,
        allowNull: false,
        
    } ,
     DESCRIPTION :{
        type: Sequelize.STRING,
        allowNull: false,
        
    },
    AMOUNT :{
        type: Sequelize.INTEGER,
        allowNull: false,
        
    },



  })
//   sequelize.sync()
//   .then(() => {
//     console.log('Database synchronized.');
//   })
//   .catch((error) => {
//     console.error('Error synchronizing the database:', error);
//   });
  
  module.exports=Xtable
  