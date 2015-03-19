"use strict";
/*global React*/

var FormPage = React.createClass({
  getInitialState: function() {
    return({ShopList: []});
  },
  componentDidMount: function() {
    $.getJSON('/shoppinglist/getlist', function(data) {
      this.setState({ShopList: data});
      console.log(ShopList);
    }.bind(this));
  },
  render: function() {
    // TODO: find a way to grab title of specified list
//    var titleCurrList = $('#titlefield').val();
    var showlist = [];
    var LIST = this.state.ShopList;
    var TITLE = '';
    if (LIST.length > 0) {
      TITLE = LIST[LIST.length-1].shoplisttitle;
      for (var i = 0; i < LIST[LIST.length-1].items.length; i++) {
        showlist.push(<tr>);
        showlist.push(<td>{LIST[LIST.length-1].items[i].owner}</td>);
        showlist.push(<td>{LIST[LIST.length-1].items[i].item}</td>);
        showlist.push(</tr>);
      }
    }
    //  }
 //   });
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
      <table>
        <thead>
        <h1>{TITLE}</h1>
        </thead>
        <tbody>
          {showlist}
        </tbody>
      </table>
      </div>
     );
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

    $.ajax({
      url: '/shoppinglist/postnewlist',
      dataType: 'json',
      type: 'POST',
      data: {'shoplisttitle': addTitle, 'items': [{'owner': addName, 'item': addItems}]},
      success: function(data) {
        console.log('data post new');
        console.log(data);

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

    console.log('name, title, items');
    console.log(addName);
    console.log(addTitle);
    console.log(addItems);

    $.ajax({
      url: '/shoppinglist/addto',
      dataType: 'json',
      type: 'POST',
      data: {'add':[addName,addItems,addTitle]},
      success: function(data) {
        this.setState({ShopList: data});
        console.log('**SUCCESS in postitems post req TITLE**');
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
