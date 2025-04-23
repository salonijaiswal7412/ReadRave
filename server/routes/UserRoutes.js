const express=require('express');
const router=express.Router();
const User=require('../models/userModel');
const {signupUser,loginUser,getProfile} =require('../controllers/userContoller');
const protect=require('../middlewares/authMiddleware');


router.post('/signup',signupUser);
router.post('/login',loginUser);

router.get('/profile',protect,getProfile);
module.exports=router;