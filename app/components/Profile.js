var React = require('react');
var Router = require('react-router');
var Repos = require('./Github/Repos');
var UserProfile = require('./Github/UserProfile');
var Notes = require('./Notes/Notes');
var ReactFireMixin = require('reactfire');
var Firebase = require('firebase');
var helpers = require('../utils/Helpers');

var Profile = React.createClass({
  mixins: [ReactFireMixin],
  getInitialState: function(){
    return {
      notes: [],
      bio: {},
      repos: []
    }
  },
  componentDidMount: function(){
    this.ref = new Firebase('https://sweltering-heat-7072.firebaseio.com/');
        // Create a callback which logs the current auth state
    function authDataCallback(authData) {
      if (authData) {
        console.log("User " + authData.uid + " is logged in with " + authData.provider);
      } else {
        console.log("User is logged out");
      }
    }
    // Register the callback to be fired every time auth state changes
    this.ref.onAuth(authDataCallback);
    // Create a callback to handle the result of the authentication
    function authHandler(error, authData) {
      if (error) {
        console.log("Login Failed!", error);
      } else {
        console.log("Authenticated successfully with payload:", authData);
      }
    }
    // Authenticate users with a custom authentication token
    // this.ref.authWithCustomToken("<token>", authHandler);
    // Alternatively, authenticate users anonymously
    // this.ref.authAnonymously(authHandler);
    // // Or with an email/password combination
    // this.ref.authWithPassword({
    //   email    : 'bobtony@firebase.com',
    //   password : 'correcthorsebatterystaple'
    // }, authHandler);
    // // Or via popular OAuth providers ("facebook", "github", "google", or "twitter")
    // this.ref.authWithOAuthPopup("<provider>", authHandler);
    // this.ref.authWithOAuthRedirect("<provider>", authHandler);
    this.ref.authWithOAuthRedirect("google", function(error) {
      if (error) {
        console.log("Login Failed!", error);
      } else {
        // We'll never get here, as the page will redirect on success.
      }
    });
    this.init(this.props.params.username)
  },
  componentWillReceiveProps: function(nextProps){
    this.unbind('notes');
    this.init(nextProps.params.username);
  },
  componentWillUnmount: function(){
    this.unbind('notes');
  },
  init: function(username){
    var childRef = this.ref.child(username);
    this.bindAsArray(childRef, 'notes');

    helpers.getGithubInfo(username)
      .then(function(data){
        this.setState({
          bio: data.bio,
          repos: data.repos
        })
      }.bind(this))
  },
  handleAddNote: function(newNote){
    console.log('handled the new note', newNote)
    this.ref.child(this.props.params.username).child(this.state.notes.length).set(newNote)
  },
  render: function(){
    return (
      <div className="row">
        <div className="col-md-4">
          <UserProfile username={this.props.params.username} bio={this.state.bio} />
        </div>
        <div className="col-md-4">
          <Repos username={this.props.params.username} repos={this.state.repos}/>
        </div>
        <div className="col-md-4">
          <Notes
            username={this.props.params.username}
            notes={this.state.notes}
            addNote={this.handleAddNote} />
        </div>
      </div>
    )
  }
})

module.exports = Profile;