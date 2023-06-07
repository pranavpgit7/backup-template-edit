const mongoose = require('mongoose')

const categorySchema = new mongoose.Schema({
    category: {
      type: String,
    },
    sub_category: {
      type: Array,
    },
  });

module.exports = {
    Category : mongoose.model('category',categorySchema)
}