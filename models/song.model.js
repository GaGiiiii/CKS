const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let songSchema = new Schema({
    name: {
      type: String,
      minlength: [2, 'Name Should Be At Least 2 Characters Long'],
      maxlength: [30, "Name Can't Be Longer Than 30 Characters"],
      required: [true, "Name Field Is Required"]
    },
    lyrics: {
      type: String,
      minlength: [30, 'Lyrics Should Be At Least 30 Characters Long'],
      maxlength: [5000, "Lyrics Can't Be Longer Than 30 Characters"],
      required: [true, "Lyrics Field Is Required"]
    },
    image: { // TODO
      type: String
    },
    created_at: {
      type: Date,
      default: Date.now
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'UserModel'
    },
});

// Export the model
module.exports = mongoose.model('SongModel', songSchema);