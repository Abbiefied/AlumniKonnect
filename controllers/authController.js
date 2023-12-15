const passport = require('passport')

exports.googleAuth = passport.authenticate('google', { scope: ['profile']})

exports.logout = (req, res, next) => {
    req.logout((error) => {
        if (error) {return next(error)}
        res.redirect('/')
    })
}

exports.ensureAuth = function (req, res, next) {
        if (req.isAuthenticated()) {
            return next()
        } else {
            res.redirect('/auth')
        }
        }
exports.ensureGuest = function (req, res, next) {
            if (req.isAuthenticated()) {
                res.redirect('/dashboard')
            } else {
                return next()
            }
        }
exports.isAdmin = function (req, res, next) {
  if (req.isAuthenticated() && req.user.role === 'admin') {
    return next();
} else {
    req.flash('error', 'Access denied! Login as an admin.')
    res.redirect('/');
}
};

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
          
          
          
