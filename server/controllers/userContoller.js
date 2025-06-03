const user=require('../models/userModel');
const bcrypt=require('bcrypt');
const User=require('../models/userModel');
const validator=require('validator');
const jwt=require('jsonwebtoken');


const createToken=(_id)=>{
    return jwt.sign({_id},process.env.SECRET,{expiresIn:'3d'});
}

const signupUser=async (req,res)=>{
    const {name,email,password}=req.body;
    try{
        const user=await User.signup(name,email,password);
        const token=createToken(user._id);
        res.status(200).json({email,token})
    }catch(error){
        res.status(400).json({error:error.message})
    }
    

};
 
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'All fields must be filled' });
    }

    try {
        const user = await User.login(email, password);
        const token = createToken(user._id);
        res.status(200).json({ user, token,message:'successfully logged in' });
    } catch (error) {
        
        res.status(400).json({ error: error.message });
    }
};

const getProfile=async(req,res)=>{
     try {
    // req.user is set by your protect middleware
    const user = {
      _id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      // Add any other profile fields you want to return
      // avatar: req.user.avatar,
      // createdAt: req.user.createdAt,
      // etc.
    };

    res.status(200).json(user);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ error: 'Server error while fetching profile' });
  }
};


module.exports={signupUser,loginUser,getProfile};