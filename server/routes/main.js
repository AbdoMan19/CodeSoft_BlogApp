const express=require('express');
const router=express.Router();
const mongoose=require('mongoose')
const Post=require('../models/Post');
const User = require('../models/User');


const authMiddleware=(req,res,next)=>{
  const token=req.cookie.token;
  if(!token){
    return res.status(401).json({message:'Unauthorized'});

  }
  try {
    const decoded=jwt.verify(token,jwtSecret);
    res.userId=decoded.userId;
    
  } catch (error) {
    console.log(error);
  }
}

router.get('/', async (req, res) => {
  try {
    const [featuredPost, mostReadPost] = await Promise.all([
      Post.aggregate([
        { $sort: { createdAt: -1 } },
        { $limit: 3 },
        { $lookup: { from: 'users', localField: 'user', foreignField: '_id', as: 'user' } },
        { $unwind: '$user' },
        { $project: { title: 1,body:1 ,image: 1, 'user.username': 1,'user.image':1 , createdAt: 1, comments: 1, tag: 1 } }
      ]),
      Post.aggregate([
        { $sort: { views: -1 } },
        { $limit: 3 },
        { $lookup: { from: 'users', localField: 'user', foreignField: '_id', as: 'user' } },
        { $unwind: '$user' },
        { $project: { title: 1,body:1 , image: 1, 'user.username': 1,'user.image':1, createdAt: 1, comments: 1, tag: 1 } }
      ])
    ]);

    res.render('home', {
      featuredPost,
      mostReadPost,
      hideHeader:false,
      hideFooter:false
    });
  } catch (error) {
    console.error(error);
  }
});


// Call the function to insert posts
// insertPostData();








module.exports=router