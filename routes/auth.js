const express = require('express')
const passport = require('passport')
const router = express.Router()


// Auth with Google
router.get('/google', passport.authenticate('google', { scope: ['profile']}))


// Google auth callback
router.get('/google/callback', passport.authenticate('google', {failureRedirect:'/'}),
(req, res) => {
    res.redirect('/dashboard')
})

//Logout user
router.get('/logout', (req, res, next) => {
    req.logout((error) => {
        if (error) {return next(error)}
        res.redirect('/')
    })
})

module.exports = router