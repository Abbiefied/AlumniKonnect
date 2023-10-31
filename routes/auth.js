const express = require('express')
const passport = require('passport')
const router = express.Router()
const controller = require('../controllers/authController')


// Auth with Google
router.get('/google', controller.googleAuth)


// Google auth callback
router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/' }),
(req, res) => {
  res.redirect('/dashboard')
})

//Logout user
router.get('/logout', controller.logout)

module.exports = router