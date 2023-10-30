const express = require('express')
const router = express.Router()
const { ensureAuth, ensureGuest } = require ('../controllers/middleware/authController')

const Event = require('../models/Event')

// Login/Landing page
router.get('/', ensureGuest, (req, res) => {
    res.render('login', {
        layout: 'login',
    })
})


// Dashboard page
router.get('/dashboard', ensureAuth, async (req, res) => {
    try {
        const events = await Event.find({ user: req.user.id }).lean()
        res.render('dashboard', {
            name:req.user.firstName,
            events
        })
    } catch (error) {
        console.error(error)
        res.render('error/500')
    }
})

module.exports = router