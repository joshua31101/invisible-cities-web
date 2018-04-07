import React, { Component } from 'react';

export default class Footer extends Component {
  render() {
    return(
      <footer>
        <div className="container">
          <div className="row">
            <div className="logo-container col-sm-12 col-md-4 text-center">
              <a href="http://www.gatech.edu/">
                <img alt="Georgia Tech" src="/assets/images/gt-logo-footer.png" />
              </a>
              <p className="copyright">© Georgia Institute of Technology</p>
            </div>
            <div className="footer-links col-sm-12 col-md-8" role="navigation" aria-label="Legal">
              <ul>
                <li className="first"><a href="http://www.gatech.edu/emergency/">Emergency Information</a></li>
                <li><a href="http://www.gatech.edu/legal/">Legal &amp; Privacy Information</a></li>
                <li><a href="http://www.gatech.edu/accessibility/">Accessibility</a></li>
                <li><a href="http://www.gatech.edu/accountability/">Accountability</a></li>
                <li><a href="https://www.gatech.edu/accreditation/" className="">Accreditation</a></li>
                <li className="last"><a href="http://www.careers.gatech.edu">Employment</a></li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    );
  }
}
