const mongoose = require("mongoose");

const favoriteBrandSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("FavoriteBrand", favoriteBrandSchema);
