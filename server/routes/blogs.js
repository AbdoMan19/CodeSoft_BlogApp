const express=require('express');
const router=express.Router();
const Post=require('../models/Post');
const Tag=require('../models/Tag')

router.get('/', async (req, res) => {
    try{
        let perPage=6;
        let page=req.query.page || 1;
        const posts = await Post.aggregate([{ $sort: {createdAt: -1}}])
        .skip(perPage * page -perPage)
        .limit(perPage)
        .exec();

        const count = await Post.count();
        const nextPage=parseInt(page) +1;
        const hasNextPage = nextPage <=Math.ceil(count / perPage);

        res.render('blogs', {
            posts,
            current:page,
            nextPage:hasNextPage ? nextPage : null,
            hideHeader:false,
            hideFooter:false
        });
    }catch(error){
        console.log(error)
    }
})
router.get('/:id', async (req, res) => {
    try{
        const post=await Post.findById({_id:req.params.id}).populate('user');
        
        if(!post){
            throw new Error("No Post Found")
        }
        res.render('blog', {
            post,
            hideHeader:false,
            hideFooter:false
            
        });
    }catch(error){
        res.write("unexpected error")
    }
})

module.exports=router