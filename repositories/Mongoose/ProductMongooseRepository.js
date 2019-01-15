var mongoose = require("mongoose");
var ObjectId = mongoose.Types.ObjectId;
var ProductDB = require("./model/Product");

var ProductEntity = require("../../entities/ProductEntity");
var IRepository = require("../IRepository");
var UID = require("../../lib/uid/UID");

class ProductMongooseRepository extends IRepository {
  constructor() {
    super();
  }

  add(product) {
    return new Promise((resolve, reject) => {
      if (!product instanceof ProductEntity) return reject("The first argument is NOT a ProductEntity");

      var productDb = new ProductDB(product);

      productDb.save(function (err, data) {
        if (err) {
          return reject("Database Error: ProductEntity has NOT been saved");
        }

        resolve();
      });
    });
  }

update(query, product) {
  return new Promise((resolve, reject) => {
    if (!query instanceof Object) return reject("The first argument is NOT a valid object");
    if (!product instanceof ProductEntity) return reject("The second argument is NOT a ProductEntity");

    ProductDB.findOneAndUpdate(query, product, { new: true }, function (err, data) {
      if (err) {
        return reject("Database Error: ProductEntity has NOT been updated");
      }

      resolve();
    });
  });
}

  getByUid(uid) {
    return new Promise((resolve, reject) => {
      if (!UID.isValid(uid)) {
        return reject("The first argument is NOT a valid uid");
      }

      ProductDB.findOne({ uid: uid }).exec(function (err, productDb) {
        if (err || !productDb) {
          return resolve(undefined);
        }

        try {
          var product = new ProductEntity(productDb.uid);
          product.name = productDb.name;
          product.price = productDb.price;

          resolve(product);
        } catch (err) {
          reject(err);
        }
      });
    });
  }

  mapGetFilters(filters) {
    var getFilters = [];

    if (filters === undefined) {
      return undefined;
    }

    if (filters[this.GET_FILTER_SORT]) {
      getFilters.push({ $sort: filters[this.GET_FILTER_SORT] });
    }

    if (filters[this.GET_FILTER_SKIP]) {
      var skip = parseInt(filters[this.GET_FILTER_SKIP]);

      if (isNaN(skip)) {
        throw new Error("skip filter is NOT a valid number");
      }

      getFilters.push({ $skip: skip });
    }

    if (filters[this.GET_FILTER_LIMIT]) {
      var limit = parseInt(filters[this.GET_FILTER_LIMIT]);

      if (isNaN(limit)) {
        throw new Error("limit filter is NOT a valid number");
      }

      getFilters.push({ $limit: limit });
    }

    return getFilters;
  }

  get(match, filters) {
    return new Promise((resolve, reject) => {
      try {
        filters = this.validateGetFilters(filters);
      } catch (err) {
        return reject(err);
      }

      var query = [];

      if (match !== undefined) {
        query.push({ $match: match });
      };

      query.push({ $project: { uid: 1, name: 1, price: 1 } });


      try {
        var getFilters = this.mapGetFilters(filters);

        if (getFilters !== undefined) {
          query = query.concat(getFilters);
        }
      } catch (err) {
        return reject(err);
      }

      console.log(query);
      ProductDB.aggregate(query).exec(function (err, productsDb) {
        if (err || productsDb.length == 0) {
          return resolve(undefined);
        }

        try {
          var products = [];

          productsDb.forEach(productDb => {
            var product = new ProductEntity(productDb.uid);
            product.name = productDb.name;
            product.price = productDb.price;

            products.push(product);
          });

          resolve(products);
        } catch (err) {
          reject(err);
        }
      });
    });
  }

  remove(filter) {
    return new Promise((resolve, reject) => {
      ProductDB.remove(filter, function (err) {
        if (err) {
          return reject("Database Error: ProductEntity has NOT been removed");
        }

        resolve();
      });
    });
  }
}

module.exports = ProductMongooseRepository