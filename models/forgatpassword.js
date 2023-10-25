const Sequelize=require('sequelize');
const sequelize = require('../util/util')

const ForgotPassword=sequelize.define('forgotpassword',{
    
UUID: {
        type: Sequelize.UUID,
        allowNull: false,
        primaryKey: true,
        unique: true,
       
       },
    

isActive :{
    type: Sequelize.BOOLEAN,
    allowNull: false,
    
       } ,




})
module.exports =ForgotPassword