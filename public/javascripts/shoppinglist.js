"use strict";
/*global React*/
var socket = io();

var FormPage = React.createClass({
  getInitialState: function() {
    socket.on('sms recv', function(data) {
      var x = new Date();
      var y = x.getTime();
      $.ajax({
        url: '/shoppinglist/addto',
        dataType: 'json',
        type: 'POST',
        data: {'itemid': y, 'owner': data.from, 'item': data.items},
        success: function(data) {
          console.log('data');
          console.log(data);

          this.setState({ShopList: data});

          console.log('**SUCCESS in ADDITEMS**');
        }.bind(this),
        error: function(xhr, status, err) {
          console.error(this.props.url, status, err.toString());
        }.bind(this)
      });
//      console.log(this.state.ShopList[0]);
//      var newShopList = this.state.ShopList[0];
//      var newItems = newShopList.items;
//      newItems.push(post);
//      newShopList.items = newItems;
//
//      this.setState({ShopList: [newShopList]});

    }.bind(this));

    return({ShopList: []});
  },
  componentDidMount: function() {

    //BTW: currently loads most recent list on refresh

    $.getJSON('/shoppinglist/getlist', function(data) {
      console.log('inside CompDIdMount GET');
      this.setState({ShopList: data});
    }.bind(this));
  },
  render: function() {
    var showList = [];
    var currList = this.state.ShopList;
    var currTitle = '';
    console.log(showList);
    if (currList.length > 0) {
      currTitle = currList[0].shoplisttitle;
      console.log('Rendering list: ');
      console.log(currList[0].items);
      for (var i = 0; i < currList[0].items.length; i++) {
        console.log('Adding list item!');
        showList.push(<tr>
                      <td>{currList[0].items[i].owner}</td>
                      <td>{currList[0].items[i].item}</td>
                      <td><button onClick={this._handleDelete} id={currList[0].items[i]._id} className="btn btn-danger btn-xs">destroy</button></td>
                      </tr>);
      }
    }
    console.log('showList:');
    console.log(showList);
    return (
    <div>
    <head>
    <script type="text/javascript" src="sms.js"/>
    </head>
    <form>
      <input type="text" ref="namefield" placeholder="enter name.."/>
      <br/>
      <textarea rows="10" cols="80" ref="itemfield" placeholder="enter item.."/>
      <br/>
      <button className="btn btn-primary" onClick={this._createNew}>create new list</button>
      <button id="titlesubmit" className="btn btn-default" style={{display:'none'}} onClick={this._postNew}>post new list</button>
      <button className="btn btn-info" onClick={this._addItems}>add item(s)</button>
      <button className="btn btn-warning" onClick={this._sendSms}>sms</button>
      <button className="btn btn-success" onClick={this._authUser}>authUser</button>
    </form>
    <table className="table">
      <thead>
      <h1>{currTitle}</h1>
      </thead>
      <tbody>
        {showList}
      </tbody>
    </table>
    </div>
   );
  },
  _authUser: function(event) {
    event.preventDefault();
  },
  _sendSms: function(event){
    event.preventDefault();
    return (
      $.ajax({
        url: '/shoppinglist/sendsms',
        dataType: 'json',
        type: 'POST',
        data: true,
        success: function() {
        }.bind(this),
        error: function(xhr, status, err) {
          console.error(this.props.url, status, err.toString());
        }.bind(this)
      })
   );
  },
  _handleDelete: function(event){
    event.preventDefault();
    console.log('inside DELETE');

    var itemId = $(event.target).attr('id');
    $.ajax({
      type: 'DELETE',
      url: '/shoppinglist/deleteitem/' + itemId,
      success: function(data) {
        console.log('success DELETE');
        console.log('data');
        console.log(data);

        this.setState({ShopList: data});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  _createNew: function(event) {
    event.preventDefault();
    $('#titlefield').show();
    $('#titlefield').val = '';
    $('#titlesubmit').show();
  },
  _postNew: function(event) {
    event.preventDefault();
    console.log('submitting new');

    var addTitle = $('#titlefield').val();
    var addName = this.refs.namefield.getDOMNode().value.trim();
    var addItems = this.refs.itemfield.getDOMNode().value.trim();

    $('#titlefield').hide();
    $('#titlesubmit').hide();
    this.refs.namefield.getDOMNode().value = '';
    this.refs.itemfield.getDOMNode().value = '';

    var x = new Date();
    var y = x.getTime();
    $.ajax({
      url: '/shoppinglist/postnewlist',
      dataType: 'json',
      type: 'POST',
      data: {'shoplisttitle': addTitle, 'itemid': y, 'owner': addName, 'item': addItems},
      success: function(data) {
        console.log('SUCCESS in POSTNEW');

        this.setState({ShopList: data});

      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });

  },
  _addItems: function(event) {
    event.preventDefault();
    console.log('adding to');

    var addTitle = $('#titlefield').val();
    var addName = this.refs.namefield.getDOMNode().value.trim();
    var addItems = this.refs.itemfield.getDOMNode().value.trim();

    this.refs.namefield.getDOMNode().value = '';
    this.refs.itemfield.getDOMNode().value = '';

    var x = new Date();
    var y = x.getTime();
    $.ajax({
      url: '/shoppinglist/addto',
      dataType: 'json',
      type: 'POST',
      data: {'shoplisttitle': addTitle, 'itemid': y, 'owner': addName, 'item': addItems},
      success: function(data) {

        this.setState({ShopList: data});

        console.log('**SUCCESS in ADDITEMS**');
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
   }
});

$(document).ready(function() {
  React.render(
    <FormPage/>,
    $('#content')[0]);
});
