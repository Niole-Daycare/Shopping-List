"use strict";
/*global React*/
module.exports = function(io) {
  var express = require('express');
  var router = express.Router();
  var twilio = require('twilio');

  // TODO: Remove
  io.on('connection', function(socket){
    console.log('a user connected');
    socket.on('disconnect', function(){
      console.log('user disconnected');
    });
  });

router.post('/sendsms', function(req, res) {
  console.log('inside sendsms');
  var accountSid = process.env.ACCOUNTSID;
  var authToken = process.env.AUTHTOKEN;
  var client = twilio(accountSid, authToken);

  client.sms.messages.create({
    to: process.env.toNum,
    from: process.env.fromNum,
    body:'Going to the store. Anyone want anything?'
  }, function(error, message) {
    if (!error) {
      console.log('Success! The SID for this SMS message is:');
      console.log(message.sid);

      console.log('Message sent on:');
      console.log(message.dateCreated);
    } else {
      console.log('Oops! There was an error.');
    }
  }
                            );
                            res.json(true);
});

router.post('/addfromsms', function(req, res) {
  var data = {
    'from' : req.body.From,
    'items' : req.body.Body // TODO: Split items into a list
  };
  console.log('Received POST from Twilio:' + JSON.stringify(data));
  io.emit('sms recv', data, { for: 'everyone' });
});

router.post('/postnewlist', function(req, res) {
  console.log('inside post postnewlist');

  var db = req.db;
  var itemParams = {_id: req.body.itemid, 'shoplisttitle': req.body.shoplisttitle, 'owner': req.body.owner, 'item': req.body.item};
  var shopListParams = {_id: req.body._id, 'shoplisttitle':req.body.shoplisttitle, 'items':[itemParams]};
  db.collection('listcollection').remove({}, function(err, result) {
    db.collection('listcollection').insert(shopListParams, function(err, newList) {
      console.log('newList');
      console.log(newList);
      res.json(newList);
    });
  });
});

router.post('/addto', function(req, res) {
  console.log('inside post addto');

  var db = req.db;
  var targetList = req.body.shoplisttitle;
  var itemParams = {_id: req.body.itemid, 'owner': req.body.owner, 'item': req.body.item};
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

      db.collection('listcollection').find().toArray( function(err, shopList) {
        res.json(shopList);
      });
    });
  });

});

router.get('/getlist', function(req, res) {
  console.log('INSIDE GET');

  var db = req.db;
  db.collection('listcollection').find().toArray(function(err, theList) {

    res.json(theList);
  });
});

return router;
};
