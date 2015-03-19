"use strict";
var express = require('express');
var router = express.Router();

router.post('/postnewlist', function(req, res) {
  console.log('inside post postnewlist');
  var db = req.db;
  //items: [[submitter's name, submitter's item]]
  db.collection('listcollection').insert(req.body, function(err, result) {
      db.collection('listcollection').find().toArray(function(err, result) {
        console.log('contribs');
        console.log(result);
        res.json(result);
      });
  });
});

router.post('/addto', function(req, res) {
  console.log('inside post addto');
  var db = req.db;
  db.collection('listcollection').update( {'shoplisttitle': req.body.add[2]}, {$push: {'items':{'owner': req.body.add[0], 'item': req.body.add[1]}}}, function(err, result) {
    db.collection('listcollection').find().toArray(function(err, result) {
      console.log('added to db');
      console.log(result.items);
      res.json(result);
    });
  });
});

router.get('/getlist', function(req, res) {
  console.log('INSIDE GET');
  var db = req.db;
  db.collection('thelist').find().toArray(function(err, contributions) {
    res.json(contributions);
  });
});

module.exports = router;
