var mongoose = require('mongoose');
mongoose.Promise = global.Promise;

module.exports = mongoose.Schema({
  uid: String,
  name: String,
  price: Number
});