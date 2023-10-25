const express=require('express')
const router=express.Router()
const purchaseController=require('../controller/purchase')
const userAuthentication=require('../middleware/auth')

router.get('/purchase/premiummembership',userAuthentication.authenticate,purchaseController.purchasePremium)
router.post('/purchase/premiummembership/updatestatus',userAuthentication.authenticate,purchaseController.updateMembership)



module.exports=router