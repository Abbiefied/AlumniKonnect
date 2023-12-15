const express = require("express");
const router = express.Router();
const { ensureAuth, ensureGuest } = require("../controllers/authController");
const Event = require("../models/Event");
const User = require('../models/User');

// Landing page
router.get("/", (req, res) => {
  if (req.isAuthenticated()) {
    res.render("./guest/index", {
      image: req.user.image,
    });
  } else {
    res.render("./guest/index");
  }
});

// About page
router.get("/about", (req, res) => {
  if (req.isAuthenticated()) {
    res.render("guest/about", { image: req.user.image });
  } else {
    res.render("guest/about");
  }
});

// Contact page
router.get("/contact", (req, res) => {
  if (req.isAuthenticated()) {
    res.render("guest/contact", { image: req.user.image });
  } else {
    res.render("guest/contact");
  }
});

// Alumni Dashboard page
router.get("/dashboard", ensureAuth, async (req, res) => {
  try {
    const events = await Event.find({ user: req.user.id }).lean();
    res.render("dashboard", {
      firstName: req.user.firstName,
      lastName: req.user.lastName,
      email: req.user.email,
      image: req.user.image,
      phone: req.user.phone,
      highestDegree: req.user.highestDegree,
      bio: req.user.bio,
      events,
    });
    console.log(req.user);
  } catch (error) {
    console.error(error);
    res.render("error/500");
  }
});


router.get("/gallery", (req, res) => {
  res.render("./events/gallery", {
    image: req.user.image
  });
});

router.post('/dashboard', ensureAuth, async (req, res) => {
  try {
    const { email, phone, highestDegree, bio } = req.body;

    // Update user information
    await User.findByIdAndUpdate(req.user.id, {
      email,
      phone,
      highestDegree,
      bio,
    });

    res.redirect('/dashboard');
  } catch (error) {
    console.error(error);
    res.render('error/500');
  }
});

router.get("/opportunity", ensureAuth, (req, res) => {
  res.render("opportunity", {
    name: req.user.firstName,
    image: req.user.image
  });
});

module.exports = router;
