const mongoose = require('mongoose');
const comment=new mongoose.Schema({
    text:{
        type:String,
        required:true,
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        require:true,
    }
},{timestamps:true})

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  body: {
    type: String,
    required: true,
  },
  image: {
    type: String, 
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', 
    required: true,
  },
  comments:{
  type:[comment],
  default:[],
  },
  tag:{
    type:String,
    required:true,
  },
  views: {
    type: Number,
    default: 0,
  },
},{timestamps:true});

const Post = mongoose.model('Post', postSchema);

module.exports = Post;
