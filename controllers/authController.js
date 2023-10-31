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
            res.redirect('/login')
        }
        }
exports.ensureGuest = function (req, res, next) {
            if (req.isAuthenticated()) {
                res.redirect('/dashboard')
            } else {
                return next()
            }
        }

