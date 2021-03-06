const firebase = require('./firebaseController');

exports.loginGet = (req, res) => {
  const err = req.session.error;
  delete req.session.error;
  res.render('login', { error: err });
};

exports.loginPost = (req, res) => {
  if (!req.body) {
    req.session.error = 'Please type an email and password.';
  }
  const email = req.body.email;
  const password = req.body.password;
	firebase.login(email, password, (error, isAdminUser) => {
    if (error) {
      req.session.error = 'Incorrect username or password.';
      res.redirect('/login');
    } else {
      req.session.email = email;
      req.session.isAdminUser = isAdminUser;
      res.redirect('/');
    }
  });
};

exports.logout = (req, res) => {
	firebase.logout((error) => {
    if (error) {
      return res.status(500).send(error.message);
    } else {
      delete req.session.email;
      delete req.session.isAdminUser;
      res.redirect('/');
    }
  });
};
