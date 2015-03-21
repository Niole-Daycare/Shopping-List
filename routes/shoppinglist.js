"use strict";
var express = require('express');
var router = express.Router();

router.post('/postnewlist', function(req, res) {
  console.log('inside post postnewlist');

  var db = req.db;
  var itemParams = {_id: req.body.itemid, 'shoplisttitle': req.body.shoplisttitle, 'owner': req.body.owner, 'item': req.body.item};
  var shopListParams = {_id: req.body._id, 'shoplisttitle':req.body.shoplisttitle, 'items':[itemParams]};

  db.collection('listcollection').insert(shopListParams, function(err, recentList) {
    res.json(recentList);
  });
});

router.post('/addto', function(req, res) {
  console.log('inside post addto');

  var db = req.db;
  var targetList = req.body.shoplisttitle;
  var itemParams = {_id: req.body.itemid, 'shoplisttitle': req.body.shoplisttitle, 'owner': req.body.owner, 'item': req.body.item};

  db.collection('listcollection').update( {'shoplisttitle': targetList}, {$push: {'items': itemParams}}, function(err, result) {

    db.collection('listcollection').find( { 'shoplisttitle': targetList } ).toArray( function(err, shopList) {
      res.json(shopList);
    });
  });
});

router.delete('/deleteitem/:id', function(req, res) {
  var db = req.db;
  var targetId = req.params.id;

  db.collection('listcollection').find( { 'items': { $elemMatch: { _id: targetId } } } ).toArray( function(err, item) {

    db.collection('listcollection').update( {}, {  $pull: { 'items': { _id: targetId } } }, { multi: true }, function(err, updated) {

      db.collection('listcollection').find( { 'shoplisttitle': item[0].shoplisttitle } ).toArray( function(err, shopList) {
        res.json(item[0].shoplisttitle);
      });
    });
  });

});

router.get('/getlist', function(req, res) {
  console.log('INSIDE GET');

  var db = req.db;
  db.collection('listcollection').find().toArray(function(err, contributions) {
    res.json(contributions);
  });
});

module.exports = router;
