"use strict";
/*global React*/

var FormPage = React.createClass({
  getInitialState: function() {
    return({ShopList: []});
  },
  componentDidMount: function() {

    //BTW: currently loads most recent list on refresh

    $.getJSON('/shoppinglist/getlist', function(data) {
      this.setState({ShopList: data});
    }.bind(this));
  },
  render: function() {
    var showList = [];
    var currList = this.state.ShopList;
    var currTitle = '';
    if (currList.length > 0) {
    currTitle = currList[currList.length-1].shoplisttitle;
      for (var i = 0; i < currList[currList.length-1].items.length; i++) {
        showList.push(<tr>);
        showList.push(<td>{currList[currList.length-1].items[i].owner}</td>);
        showList.push(<td>{currList[currList.length-1].items[i].item}</td>);
        showList.push(<td><button onClick={this._handleDelete} rel={currList[currList.length-1].items[i]._id} className="btn btn-primary">x</button></td>);
        showList.push(</tr>);
    }
    }
    return (
    <div>
    <form>
      <input type="text" ref="namefield" placeholder="enter name.."/>
      <br/>
      <textarea rows="10" cols="80" ref="itemfield" placeholder="enter item.."/>
      <br/>
      <button className="btn btn-primary" onClick={this._addItems}>add item(s)</button>
      <button className="btn btn-primary" onClick={this._createNew}>create new list</button>
      <button id="titlesubmit" className="btn btn-primary" style={{display:'none'}} onClick={this._postNew}>post new list</button>
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
  _handleDelete: function(event){
    event.preventDefault();
    console.log('inside DELETE');

    var itemId = $(event.target).attr('rel');
    $.ajax({
      type: 'DELETE',
      url: '/shoppinglist/deleteitem/' + itemId,
      success: function(shoptitle) {
        console.log('success DELETE');

        $.getJSON('/shoppinglist/getlist', function(data) {
          console.log('in GET in DELETE');

          data.forEach( function(shopObj) {
            if (shopObj.shoplisttitle === shoptitle) {

              this.setState({ShopList: [shopObj]});
            }
          }.bind(this));
        }.bind(this));
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  _createNew: function(event) {
    event.preventDefault();
    $('#titlefield').val = '';
    $('#titlefield').show();
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

//var HomePage = React.createClass({
//  render: function() {
//    return (
//      <p>heyyyy</p>
//    );
//  }
//});
//
//var Main = React.create({
//  getInitialState: function() {
//    return {component: <div/>};
//  },
//  componentDidMount: function() {
//  },
//  render: function() {
//    return this.state.component;
//  }
//});
//$(document).ready(function(){
//  React.render(
//    <HomePage/>,
//    $('#content1')[0]);
//  React.render(
//    <FormPage/>,
//    $('#content2')[0]);
//});
