const express = require('express')
const router = express.Router()
const { ensureAuth, ensureGuest } = require ('../controllers/middleware/authController')

// Login/Landing page
router.get('/', ensureGuest, (req, res) => {
    res.render('login', {
        layout: 'login',
    })
})


// Dashboard page
router.get('/dashboard', ensureAuth, (req, res) => {
    res.render('dashboard', {
        name:req.user.firstName,
    })
})

module.exports = router