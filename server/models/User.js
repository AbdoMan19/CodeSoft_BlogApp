const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  image:{
    type:String,
    default:"https://cdn-icons-png.flaticon.com/512/149/149071.png"
  }
  
});

const User = mongoose.model('User', userSchema);

module.exports = User;
