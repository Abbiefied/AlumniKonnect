const express = require("express");
const router = express.Router();
const { ensureAuth } = require("../controllers/middleware/authController");

const Event = require("../models/Event");

// Show add event page
router.get("/add", ensureAuth, (req, res) => {
  res.render("events/add");
});

// Process add event form
router.post("/", ensureAuth, async (req, res) => {
  try {
    req.body.user = req.user.id;
    await Event.create(req.body);
    res.redirect("/dashboard");
  } catch (error) {
    console.error(error);
    res.render("error/500");
  }
});

// Show all event page
router.get("/", ensureAuth, async (req, res) => {
  try {
    const events = await Event.find({ status: "public" })
      .populate("user")
      .sort({ createdAt: "desc" })
      .lean();

    res.render("events/allevents", {
      events,
    });
  } catch (error) {
    console.error(error);
    res.render("/error/500");
  }
});

// View event full detail
router.get("/:id", ensureAuth, async (req, res) => {
  try {
    let event = await Event.findById(req.params.id).populate("user").lean();

    if (!event) {
      return res.render("error/404");
    }
    if (event.user._id != req.user.id && event.status == "private") {
      res.render("error/404");
    } else {
      res.render("events/show", {
        event,
      });
    }
  } catch (error) {
    console.error(error);
    res.render("error/404");
  }
});

// Edit event page
router.get("/edit/:id", ensureAuth, async (req, res) => {
  try {
    const event = await Event.findOne({
      _id: req.params.id,
    }).lean();

    if (!event) {
      return res.render("error/404");
    }

    if (event.user != req.user.id) {
      res.redirect("/events");
    } else {
      res.render("events/edit", {
        event,
      });
    }
  } catch (error) {
    console.error(err);
    res.render("error/500");
  }
});

// Update event
router.put("/:id", ensureAuth, async (req, res) => {
  try {
    const existingEvent = await Event.findById(req.params.id).lean();

    if (!existingEvent) {
      return res.render("error/404");
    }

    if (existingEvent.user != req.user.id) {
      return res.redirect("/events");
    }

    const updatedEvent = await Event.findOneAndUpdate(
      { _id: req.params.id },
      req.body,
      { new: true, runValidators: true }
    );

    res.redirect("/dashboard");
  } catch (err) {
    console.error(err);
    res.render("error/500");
  }
});

// Delete event
router.delete("/:id", ensureAuth, async (req, res) => {
  try {
    let event = await Event.findById(req.params.id).lean()

    if (!event) {
      return res.render('error/404')
    }

    if (event.user != req.user.id) {
      res.redirect('/events')
    } else {
      await Event.deleteOne({ _id: req.params.id })
      res.redirect('/dashboard')
    }
  } catch (error) {
    console.error(error);
    return res.render("error/500");
  }
});

// User Events
router.get("/user/:userid", ensureAuth, async (req, res) => {
  try {
    const events = await Event.find({
      user: req.params.userid,
      status: "public",
    })
      .populate("user")
      .lean();

    res.render("events/allevents", {
      events,
    });
  } catch (error) {
    console.error(error);
    return res.render("error/500");
  }
});

module.exports = router;
