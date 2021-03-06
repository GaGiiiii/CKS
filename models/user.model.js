const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let userSchema = new Schema({
    username: {
      type: String,
      minlength: [2, 'Username Should Be At Least 2 Characters Long'],
      maxlength: [30, "Username Can't Be Longer Than 30 Characters"],
      required: [true, "Username Field Is Required"],
    },
    email: {
      type: String,
      required: [true, "Email Field Is Required"],
      // validate: [validateEmail, 'Please fill a valid email address'],
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please Enter a Valid Email']
    },
    password: {
      type: String,
      required: [true, "Password Field Is Required"]
    },
    created_at: {
      type: Date,
      default: Date.now
    },
    songs: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'SongModel'
    }],
});

// Export the model
module.exports = mongoose.model('UserModel', userSchema);