var express = require('express');
var router = express.Router();
var danta = require('../danta.js');

router.get('*', function(req, res, next) {
    switch (req.url) {
        case '/danta/facade':
            // object that contains all callable modules/functions
            res.status(200).send(danta.get_facade());
            break;
        default:
            // single page page
            res.render('index');
            break;
    }
});

// entry point to handle all POST server calls from the client
router.post('*', function (req, res) {
    var parts = req.url.split('/');
    var module_name = parts[1];
    var method_name = parts[2];

    var module_class = require('../modules/' + module_name + '.js');
    var module_object = new module_class();

    module_object.req = req;
    module_object.res = res;

    //console.log('calling ' + module_name + '.' + method_name, req.body);

    module_object[method_name](req.body, function (err, data) {
        if(err) {
            res.status(500).send({ err: err, data: null });
        }
        else {
            res.status(200).send({ err: null, data: data });
        }
    });
});

module.exports = router;
