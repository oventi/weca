var fs = require('fs');

var danta = (function (danta) {

    danta.get_facade = function () {
        var facade = { modules: {} };

        // load modules
        var modules = fs.readdirSync('./modules/');
        for(var i in modules) {
            var module_file = modules[i];
            var module_name = module_file.replace('.js', '');
            var module_fn = require('./modules/' + module_file);

            if(typeof facade.modules[module_name] === 'undefined') {
                facade.modules[module_name] = [];
            }

            var module_object = new module_fn();
            for(var i in module_object) {
                facade.modules[module_name].push(i);
            }
        }

        return facade;
    }

    danta.db = {
        SimpleMongo: function (url) {
            var MongoClient = require('mongodb').MongoClient;


            this.ObjectId = require('mongodb').ObjectId;
            var oid = require('mongodb').ObjectId;

            this.collection = function (name, callback) {
                MongoClient.connect(url, function(err, db) {
                    if (err) { throw err; }

                    callback(err, db.collection(name));
                });
            }

            this.find_all = function (collection, callback) {
                MongoClient.connect(url, function(err, db) {
                    if (err) { throw err; }

                    db.collection(collection).find().toArray(function (err, data) {
                        callback(err, data);
                    });
                });
            }

            this.insert = function (data, collection, callback) {
                MongoClient.connect(url, function(err, db) {
                    if (err) { throw err; }

                    db.collection(collection).insertOne(data, function(err, data) {
                        if (err) { throw err; }

                        callback(null, data.insertedId);
                    });
                });
            }

            this.update = function (collection, filter, data, callback) {
                MongoClient.connect(url, function(err, db) {
                    if (err) { throw err; }

                    db.collection(collection).update(filter, data, function(err, data) {
                        if (err) { throw err; }

                        callback(null, data);
                    });
                });
            }
        }
    };

    return danta;
})(danta || {});

module.exports = danta;
