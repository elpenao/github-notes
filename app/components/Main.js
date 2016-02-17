var React = require('react');
var SearchGithub = require('./SearchGithub')


var Main = React.createClass({
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
  },
  render: function(){
    return (
      <div className="main-container">
        <nav className="navbar navbar-default" role="navigation">
          <div className="col-sm-7 col-sm-offset-2" style={{marginTop: 15}}>
            <SearchGithub />
          </div>
        </nav>
        <div className="container">
          {this.props.children}
        </div>
      </div>
    )
  }
});

module.exports = Main;