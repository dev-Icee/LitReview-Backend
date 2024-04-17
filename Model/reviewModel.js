const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  title: {
    type: String,
    unique: true,
    required: [true, 'You must enter a book title']
  },
  coverImage: { type: String, default: 'default.jpg' },
  author: { type: String, required: [true, 'A book must have an Author'] },
  description: {
    type: String,
    required: [true, 'A book must have a description']
  },
  rating: { type: Number, default: 4.5 }
});

const Reviews = new mongoose.model('Reviews', reviewSchema);

module.exports = Reviews;
