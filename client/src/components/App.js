import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Link,
  withRouter,
  Switch,
  Redirect
 } from 'react-router-dom';

import Footer from './Footer';
import Statue from './Statue';
import StatueList from './StatueList';

const AuthRoutes = () => (
  <Router>
    <div>
      <Header />
      <Switch>
        <Route exact path="/login" component={Login} />
        <PrivateRoute path="/statue-list" component={StatueList} />
      </Switch>
      <Footer />
    </div>
  </Router>
);

const auth = {
  isAuthenticated: false,
  authenticate(cb) {
    this.isAuthenticated = true;
    setTimeout(cb, 100); // fake async
  },
  signout(cb) {
    this.isAuthenticated = false;
    setTimeout(cb, 100);
  }
};

const Header = withRouter(
  ({ history }) =>
    auth.isAuthenticated ? (
      <header>
        <section className="navbar gt-navbar">
          <div className="logo-container col-sm-3">
            <a className="navbar-brand" href="http://arts.gatech.edu/">
              <img src="/assets/images/gt-arts-logo-solid-white.png" width="30" height="30" className="d-inline-block align-top" alt="" />
            </a>
          </div>
          <div className="col-sm-6 text-center">
            <a href="/">
              <h1>Invisible Cities</h1>
            </a>
          </div>
          <div className="col-sm-3">
            <a href="/logout" className="btn btn-light btn-logout" onClick={() => { auth.signout(() => history.push("/")) }}>Logout</a>
          </div>
        </section>
        <section className="navbar menu-navbar">
          <div className="container">
            <ul>
              <li><a className="btn" href="/">Statues</a></li>
              <li><a className="btn" href="/campus-map">Campus Map</a></li>
            </ul>
          </div>
        </section>
      </header>
    ) : (
      <header>
        <section className="navbar gt-navbar">
          <div className="logo-container col-sm-3">
            <a className="navbar-brand" href="http://arts.gatech.edu/">
              <img src="/assets/images/gt-arts-logo-solid-white.png" width="30" height="30" className="d-inline-block align-top" alt="" />
            </a>
          </div>
          <div className="col-sm-6 text-center">
            <a href="/">
              <h1>Invisible Cities</h1>
            </a>
          </div>
          <div className="col-sm-3">
          </div>
        </section>
      </header>
    )
);

const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={props =>
      auth.isAuthenticated ? (
        <Component {...props} />
      ) : (
        <Redirect
          to={{
            pathname: "/login",
            state: { from: props.location }
          }}
        />
      )
    }
  />
);

class Login extends React.Component {
  state = {
    redirectToReferrer: false
  };

  login = () => {
    auth.authenticate(() => {
      this.setState({ redirectToReferrer: true });
    });
  };

  render() {
    const { from } = this.props.location.state || { from: { pathname: "/" } };
    const { redirectToReferrer } = this.state;

    if (redirectToReferrer) {
      return <Redirect to={from} />;
    }

    return (
      <main>
        <div className="jumbotron text-center">
          <h1>Login</h1>
          <p>Welcome to Invisible Cities!</p>
        </div>
        <form className="container col-sm-6" action="/login" method="post">
          <div className="form-group">
            <label htmlFor="emailInput">Email address</label>
            <input type="email" name="email" className="form-control" id="emailInput" placeholder="Enter email" required />
          </div>
          <div className="form-group">
            <label htmlFor="passwordInput">Password</label>
            <input type="password" name="password" className="form-control" id="passwordInput" placeholder="Password" required />
          </div>
          <button type="submit" className="btn btn-primary" onClick={this.login}>Submit</button>
          <div className="alert alert-danger" role="alert">
          </div>
        </form>
      </main>
    );
  }
}

export default AuthRoutes;
