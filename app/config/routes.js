var React = require('react');
var Main = require('../components/Main');
var Home = require('../components/Home');
var Profile = require('../components/Profile');
var Login = require('../components/Login');
var Router = require('react-router');
var Route = Router.Route;
var IndexRoute = Router.IndexRoute;


module.exports = (
  <Route path="/" component={Login}>
  	<Route path="main" component={Main}/>
  	<Route path="profile/:username" component={Profile}/>
    <IndexRoute component={Login} />
  </Route>
);