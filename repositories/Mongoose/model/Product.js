var mongoose = require('mongoose');
var productSchema = require("../schema/Product");
module.exports = mongoose.model('Product', productSchema, 'product');
