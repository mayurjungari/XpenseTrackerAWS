const express=require('express')
const router=express.Router()
const reportcontroller=require('../controller/Reportcontroller')

const userAuthentication=require('../middleware/auth')

router.get('/download',userAuthentication.authenticate,reportcontroller.Download)

module.exports=router