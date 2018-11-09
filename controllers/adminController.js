const firebase = require('./firebaseController');

exports.index = function(req, res) {
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
        req.session.success = 'Successfully <b>added</b> ' + email;
        res.locals.isRemoved = false;
        return res.redirect('/admin');
      });
    } else {
      req.session.error = `User with ${email} is not found.`;
      return res.redirect('/admin');
    }
  });
};

exports.adminRemovePost = function(req, res) {
  const email = req.body.email;
  firebase.removeAdmin(email, function(error) {
    if (error) {
      req.session.error = 'Something went wrong! Here is detail: ' + error;
    } else {
      req.session.success = 'Successfully ' + '<b>removed</b> ' + email;
      res.locals.isRemoved = true;
    }
    res.redirect('/admin');
  });
};
