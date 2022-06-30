const express=require('express')
const router=express.Router()



const usercontroller=require('../controller/controller.js')



const authenticate = require('../middleware/auth.js');
const taxController = require('../Controller/taxcontroller.js')


router.post('/createuser',usercontroller.createuser) 
router.post('/login',usercontroller.createlogin)

router.get('/user/:userId/profile',authenticate.authentication ,usercontroller.getUser);


router.post('/users/taxCalculator',taxController.userTaxCreation)
router.get('/users/:userId/getTaxDetails', taxController.getTaxDetailsByUserId)
router.post('/users/:userId/markTaxPaid',taxController.markTaxPaid)
router.post('/users/:userId/createAndEditTaxDue',taxController.createAndEditTaxDue)
router.get('users/:userId/getTaxDetailsFiltres',taxController.getTaxDetailsFiltres)
module.exports=router; 