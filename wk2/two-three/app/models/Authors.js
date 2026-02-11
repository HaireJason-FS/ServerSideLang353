// Schema and datatypes

const mongoose = require('mongoose');

// define schema
const authorsSchema = new mongoose.Schema({
  name: String,
  age: Number,
});

module.exports = mongoose.model('Author', authorsSchema);