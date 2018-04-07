import React, { Component } from 'react';

export default class Header extends Component {
  render() {
    const { isAuthenticated, auth } = this.props;
    return(
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

    );
  }
}
