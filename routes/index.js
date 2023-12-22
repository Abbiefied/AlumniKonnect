const express = require("express");
const router = express.Router();
const { ensureAuth, ensureGuest } = require("../controllers/authController");
const Event = require("../models/Event");
const User = require('../models/User');
const contactFormController = require('../controllers/contactFormController')

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
router.get("/about", async (req, res) => {
  try {
    const events = await Event.find({ status: "public" })
      .populate("user")
      .sort({ createdAt: "desc" })
      .limit(8)  // Limit the number of events to 8
      .lean();

    if (req.isAuthenticated()) {
      res.render("guest/about", {
        events,
        image: req.user.image,
      });
    } else {
      res.render("guest/about", { events });
    }
  } catch (error) {
    console.error(error);
    res.render("/error/500");
  }
});

// Get Contact page
router.get("/contact", (req, res) => {
  if (req.isAuthenticated()) {
    res.render("guest/contact", { image: req.user.image });
  } else {
    res.render("guest/contact");
  }
});

// Submit contact form
router.post("/contact", contactFormController.contactFormSubmit);

// Gallery page
router.get("/gallery", (req, res) => {
  if (req.isAuthenticated()) {
    res.render("./events/gallery", { image: req.user.image });
  } else {
    res.render("./events/gallery");
  }
});

// Opportunity page
router.get("/opportunity", ensureAuth, (req, res) => {
  res.render("opportunity", {
    name: req.user.firstName,
    image: req.user.image
  });
});

// Forum
router.get("/forum", ensureAuth, (req, res) => {
  res.render("forum", {
    name: req.user.firstName,
    image: req.user.image
  });
});

module.exports = router;
