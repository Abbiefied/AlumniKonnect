const passport = require('passport')


// Google Authentication
exports.googleAuth = passport.authenticate('google', { scope: ['profile']})

// Logout
exports.logout = (req, res, next) => {
    req.logout((error) => {
        if (error) {return next(error)}
        res.redirect('/')
    })
}

// Ensure Authentication
exports.ensureAuth = function (req, res, next) {
        if (req.isAuthenticated()) {
            return next()
        } else {
            res.redirect('/auth')
        }
        }

// Ensure Guest
exports.ensureGuest = function (req, res, next) {
            if (req.isAuthenticated()) {
                res.redirect('/alumni/dashboard')
            } else {
                return next()
            }
        }

// Ensure Admin
exports.isAdmin = function (req, res, next) {
  if (req.isAuthenticated() && req.user.role === 'admin') {
    return next();
} else {
    req.flash('error', 'Access denied! Login as an admin.')
    res.redirect('/');
}
};

// Set Layout
exports.setLayout = function (req, res, next) {
  if (req.isAuthenticated() && req.user.role === 'admin') {
    res.locals.layout = 'admin';
  } else if (req.isAuthenticated()) {
              res.locals.layout = 'main';
            } else {
              res.locals.layout = 'guest';
            }
            return next();
          }
          
          
          
