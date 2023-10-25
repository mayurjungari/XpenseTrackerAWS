const express=require('express')
const router=express.Router()
const userAuthentication=require('../middleware/auth')
const leaderboardController=require('../controller/leaderboard')
router.get('/showLeaderBoard',leaderboardController.LeaderboardPage)

router.get('/purchase/leaderBoard',leaderboardController.LeaderBoard)
module.exports=router