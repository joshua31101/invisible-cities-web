const firebase = require('./firebaseController');

exports.index = function(req, res) {
  if (!req.session.isAdminUser) {
    return res.status(500).send('Unauthorized access');
  }
  const error = req.session.error;
  const success = req.session.success;
  delete req.session.error;
  delete req.session.success;

  firebase.getAdmins(function(admins) {
    res.render('admin', {
      userFound: false,
      email: '',
      error: error,
      success: success,
      admins: admins,
    });
  });
};

exports.adminAddPost = function(req, res) {
  if (!req.session.isAdminUser) {
    return res.status(500).send('Unauthorized access');
  }
  const email = req.body.email;
  if (!email || (email && !email.includes('@'))) {
    req.session.error = 'Please enter a valid email.';
    return res.redirect('/admin');
  }

  firebase.hasUser(email, function(userFound, error) {
    if (error) {
      req.session.error = error.message;
      return res.redirect('/admin');
    }

    if (userFound) {
      firebase.addAdminUser(email, function(error) {
        if (error) {
          req.session.error = error.message;
          return res.redirect('/admin');
        }
        req.session.success = `Successfully added ${email}!`;
        return res.redirect('/admin');
      });
    } else {
      req.session.error = `User with ${email} is not found.`;
      return res.redirect('/admin');
    }
  });
};

exports.adminRemovePost = function(req, res) {
  if (!req.session.isAdminUser) {
    return res.status(500).send('Unauthorized access');
  }
  const email = req.body.email;
  firebase.removeAdmin(email, function(error) {
    if (error) {
      req.session.error = 'Something went wrong! Here is detail: ' + error;
    } else {
      req.session.success = `Successfully removed ${email}!`;
    }
    res.redirect('/admin');
  });
};
