var express = require('express');
var bodyParser = require('body-parser');
var config = require("config");

var mongooseData = config.get("repository.Mongoose");

var mongoose = require("mongoose");
mongoose.Promise = global.Promise;

mongoose.connect("mongodb://" + mongooseData.host + ":" + mongooseData.port + "/" + mongooseData.database);

var UIDValidator = require("./routes/validators/UIDValidator");
var DTOBodyValidator = require("./routes/validators/DTOBodyValidator");
var QueryParamsValidator = require("./routes/validators/QueryParamsValidator");

var ProductDTO = require("./dto/ProductDTO");
var ProductDTOMapper = require("./dtoMappers/ProductDTOMapper");
var ProductEntityMapper = require("./entitiesMappers/ProductEntityMapper");
var ProductMongooseRepository = require('./repositories/Mongoose/ProductMongooseRepository');

var QueryRoute = require('./routes/QueryRoute');
var InsertRoute = require('./routes/InsertRoute');
var UpdateRoute = require('./routes/UpdateRoute');
var GetRoute = require('./routes/GetRoute');
var DeleteRoute = require('./routes/DeleteRoute');

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));

// .bind() needed to refer to ProductRoute object

// Init ProductRoute

var productRepository = new ProductMongooseRepository();

var queryProductRoute = new QueryRoute(productRepository, new ProductDTOMapper(), new QueryParamsValidator());
app.get('/Product', queryProductRoute.use.bind(queryProductRoute));

var insertProductRoute = new InsertRoute(productRepository, new ProductDTOMapper(), new ProductEntityMapper(), new DTOBodyValidator(ProductDTO));
app.post('/Product', insertProductRoute.use.bind(insertProductRoute));

var updateProductRoute = new UpdateRoute(productRepository, new ProductDTOMapper(), new ProductEntityMapper(), new UIDValidator(), new DTOBodyValidator(ProductDTO));
app.put('/Product/:uid', updateProductRoute.use.bind(updateProductRoute));

var getProductRoute = new GetRoute(productRepository, new ProductDTOMapper(), new UIDValidator());
app.get('/Product/:uid', getProductRoute.use.bind(getProductRoute));

var deleteProductRoute = new DeleteRoute(productRepository, new UIDValidator());
app.delete('/Product/:uid', deleteProductRoute.use.bind(deleteProductRoute));

// catch 404 and forward to error handler

app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler

app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.send({
    status: err.status || 500,
    message: err.message
  });
});

module.exports = app;
