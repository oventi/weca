var danta = require('../danta.js');

exports = module.exports = function () {
    var self = this;
    var db = new danta.db.SimpleMongo('mongodb://localhost:27017/weca');

    self.get_list = function (params, callback) {
        db.collection('reports', function (err, collection) {
            if (err) { throw err; }

            var find_params = {};
            if(params.score_lt && !params.score_gt) {
                find_params = { score: { '$lt': params.score_lt } };
            }
            if(params.score_gt && !params.score_lt) {
                find_params = { score: { '$gt': params.score_gt } };
            }

            var sort_direction = params.sort_direction ? params.sort_direction : -1;

            collection.find(find_params).limit(10).sort({"_id": sort_direction})
                .toArray(function (err, data) {
                    callback(err, data);
                });
        });

        /*db.findAll('reports', function (err, data) {
            if (!err) {
                callback(null, data);
            }
            else {
                callback(err, null);
            }
        });*/
    }

    self.report = function (params, callback) {
        params.score = 50;
        db.insert(params, 'reports', function (err, insertId) {
            if(insertId) {
                callback(null, insertId);
            }
            else {
                callback(-1, err);
            }
        });
    }

    self.update_score = function (params, callback) {
        db.update('reports', { '_id': new db.ObjectId(params.id) }, { '$set': { 'score': params.score } }, function (err, data) {
            callback(null, data);
        });
    }
}
