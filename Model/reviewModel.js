const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  title: {
    type: String,
    unique: true,
    required: [true, 'You must enter a book title']
  },
  image: String,
  author: { type: String, required: [true, 'A book must have an Author'] },
  description: {
    type: String,
    required: [true, 'A book must have a description']
  },
  rating: { type: Number, default: 4.5 },
  active: { type: Boolean, default: true }
});

const Reviews = new mongoose.model('Reviews', reviewSchema);

module.exports = Reviews;
