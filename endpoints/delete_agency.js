/**
 * Created by lou_cifer on 15.01.17.
 */
var express = require('express');
var router = express.Router();
var agencies = require('../models/agencies');

/* GET home page. */
router.post('/', function (req, res, next) {

    var agencyID = req.body.Object.agencyID;

    if (agencyID == '') {
        return res.json({success: false, message: 'Missing obligatory parameters'});
    }

    agencies.findOne({userID: req.decoded._id,_id: agencyID}).exec(function(err, data) {
        if (!data) return res.json({success: false, message: 'This agency is missing'});
        data.remove(function (err) {
            if(err){
                return res.json({success: false, message: 'Something went wrong..'});
            }

            return res.json({success: true, message: 'Agency has been deleted successfully!'});
        });

    })


});

module.exports = router;
