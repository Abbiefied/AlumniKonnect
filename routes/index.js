const express = require("express");
const router = express.Router();
const { ensureAuth, ensureGuest } = require("../controllers/authController");

const Event = require("../models/Event");

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

// Dashboard page
router.get("/dashboard", ensureAuth, async (req, res) => {
  try {
    const events = await Event.find({ user: req.user.id }).lean();
    res.render("dashboard", {
      name: req.user.firstName,
      image: req.user.image,
      events,
    });
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

module.exports = router;
