const mongoose = require('mongoose');

const favoriteSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  pageid: {
    type: Number,
  },
  title: { type: String },
  snippet: { type: String },
});

module.exports = mongoose.model('Favorite', favoriteSchema);
