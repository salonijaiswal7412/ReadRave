const express=require('express');
const router=express.Router();
const User=require('../models/userModel');
const {signupUser,loginUser,getProfile,updateProfilePicture} =require('../controllers/userContoller');
const upload=require('../middlewares/uploadMiddleware');
const protect=require('../middlewares/authMiddleware');


router.post('/signup',signupUser);
router.post('/login',loginUser);

router.get('/profile',protect,getProfile);
router.put('/profile-picture',protect,upload.single('profilePic'),updateProfilePicture);
module.exports=router;