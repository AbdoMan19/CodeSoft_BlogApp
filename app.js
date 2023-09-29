require('dotenv').config();
const express = require('express');
const expressLayout=require('express-ejs-layouts');
const cookieParser=require('cookie-parser');
const mongoose=require('mongoose');
const Tag = require('./server/models/Tag');
const session = require('express-session');
const MongoDBStore = require("connect-mongodb-session")(session);
const store = new MongoDBStore({ uri: process.env.MONGODB_URI, collection: "sessions" }); 
const User=require("./server/models/User");
const { isAuth, isNotAuth } = require('./server/utils/validUser');
const Post = require('./server/models/Post');

const app=express();
const port=5000 || process.env.port;
app.use(express.json({ limit: "30mb" })); app.use(express.urlencoded({ extended: true, limit: "30mb" }));
app.use(cookieParser())
app.use(
  session({
    secret: "A Test Secret",
    resave: false,
    saveUninitialized: false,
    store,
  })
);
//connect to db

app.use(express.static('puplic'));

// Templating Engine
app.use(expressLayout);
app.set('layout', './layouts/main');
app.set('view engine' , 'ejs');
app.use((req, res, next) => {
    console.log(req.path, req.method);
    next();
});

app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }
  User.findById(req.session.user._id)
    .then((user) => {
      req.user = user;
      next();
    })
    .catch((err) => console.log(err));
});
app.use((req, res, next) => {
  res.locals.isAuth = req.session.isAuth;
  next();
});
app.use('/',require('./server/routes/main'));

app.use('/blogs',require('./server/routes/blogs') );

app.use('/auth',require('./server/routes/authentication'))

app.get('/about', (req, res) => {
  res.render('about',{
    hideHeader:false,
    hideFooter:false
  }); 
});

app.get('/comments/:id',async(req,res)=>{
  const post=await Post.findById({_id:req.params.id}).populate({path:'comments',populate:{path:'user'}});
  comments= post.comments;
  console.log(comments[0].user)
  res.render('comments',{
    comments,
    hideHeader:false,
    hideFooter:false,
  })
})

app.post('/add-comment',isAuth,async(req,res)=>{
  const { postId, text } = req.body;
  console.log(postId,text)

  try {
    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    post.comments.push({ text, user: req.user._id });

    await post.save();

    return res.redirect(`/comments/${postId}`)
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
})

app.get('/createPost',isAuth,async (req, res) => {
  try{
    const tags=await Tag.find();
    res.render('createPost',{
      tags,
      hideHeader:false,
      hideFooter:false
    });
  }catch(error){
    console.log(error);
  }
   
});
app.post('/publish', isAuth,async(req, res) => {
    
    const { title,
      body,
      tag,
      image}=req.body;
      const post = new Post({ title,tag, image,body,user:req.user._id});
      await post.save();
      return res.redirect('/blogs')
   
});
mongoose.connect(process.env.MONGODB_URI)
  .then(() =>
    app.listen(port, () => console.log(`Server Runnging on port :  ${port}`))
  )
  .catch((err) => console.log(err.message));
