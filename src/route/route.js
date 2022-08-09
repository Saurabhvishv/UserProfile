const express = require('express');

const router = express.Router();


const usercontroller=require("../controller/userController")
const Middleware=require("../middleware/Autentication")

//USER API
router.post('/registerUser',usercontroller.createuser)
router.post('/login',usercontroller.login)
router.get('/user/:userId/profile',Middleware.Auth,usercontroller.getUser)
router.put('/user/:userId/profile',Middleware.Auth,usercontroller.UpdateUser)
router.delete("/user/:userId", usercontroller.deleteUser)

module.exports = router;