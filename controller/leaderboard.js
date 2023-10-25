const Sequelize=require('sequelize');
const sequelize = require('../util/util')
const path=require('path')
const Account=require('../models/User')
const Xtable=require('../models/expense')
module.exports.LeaderboardPage=(req,res)=>{
    res.sendFile(path.join(__dirname,'../','Views','leaderboard.html'))
}

module.exports.LeaderBoard=async (req,res)=>{
    try {
        const userLeaderBoard = await Account.findAll({
            
            order: [['TotalExpense','DESC']]
        });
    
       
        
        res.json({'userAgregate':userLeaderBoard})
    } catch (error) {
        console.error(error);
    }
    }