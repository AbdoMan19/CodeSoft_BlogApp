const express=require('express');
const router=express.Router();
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');
const User = require('../models/User');
const { isNotAuth, isAuth } = require('../utils/validUser');


const jwtSecret= process.env.JWT_SECRET;

router.get('/', isNotAuth,async (req, res) => {
    try{
        res.render('login',{ hideHeader: true, hideFooter: true })
    }catch(error){
        res.write("unexpected error")
    }
})


router.post('/login', isNotAuth,async (req, res) => {
    const {email,password}=req.body;
    const user=await User.findOne({email});
    if(!user){
        return res.status(401).json({message:'Invalid Credentials'})
    }

    const isPasswordValid=await bcrypt.compare(password,user.password);
    if(!isPasswordValid){
        return res.status(401).json({message:'Invalid Credentials'})
    }
    req.session.isAuth = true;
    req.session.user = user;
    req.session.save((err) => {
        console.log(err);
        const token=jwt.sign({userId:user._id},jwtSecret); 
        res.cookie('token',token,{httpOnly:true});
        return res.redirect("/");
    });

    
})



router.post('/register', async (req, res) => {
    const { username, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log(username, email, password);
    try {
        const validUsername = await User.findOne({ username });
        const validEmail = await User.findOne({ email });
        if (validUsername || validEmail) {
            res.status(409).json({ message: "User Already in use" });
        } else {
            const user = new User({ username, email, password: hashedPassword});
            await user.save();
           
            
        }
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
    res.redirect('/auth');
});
router.post('/logout',isAuth,async (req, res) => {
    req.session.destroy((err) => {
        console.log(err);
        res.redirect("/");
    });
})

module.exports=router