const Event = require("../models/Event");
const { ensureAuth } = require("./authController");
const { validateEvent } = require("../middleware/validators");

exports.add_event =
  (ensureAuth,
  (req, res) => {
    res.render("events/add", { errors: [], image: req.user.image });
  });

//process add form
exports.process_add = [
  ensureAuth,
  validateEvent,
  async (req, res) => {
    try {
      req.body.user = req.user.id;
      await Event.create(req.body);
      res.redirect("/dashboard");
    } catch (error) {
      if (error.name === "ValidationError") {
        const errors = Object.values(error.errors).map((e) => e.message);
        return res.render("events/add", { errors, formData: req.body, image: req.user.image });
      }
      console.error(error);
      res.render("error/500");
    }
  },
];

exports.show_events =
  (ensureAuth,
  async (req, res) => {
    try {
      const events = await Event.find({ status: "public" })
        .populate("user")
        .sort({ createdAt: "desc" })
        .lean();

      res.render("events/allevents", {
        events, image: req.user.image
      });
    } catch (error) {
      console.error(error);
      res.render("/error/500");
    }
  });

exports.view_events =
  (ensureAuth,
  async (req, res) => {
    try {
      let event = await Event.findById(req.params.id).populate("user").lean();

      if (!event) {
        return res.render("error/404");
      }
      if (event.user._id != req.user.id && event.status == "private") {
        res.render("error/404");
      } else {
        res.render("events/show", {
          event, image: req.user.image
        });
      }
    } catch (error) {
      console.error(error);
      res.render("error/404");
    }
  });

exports.edit_eventpage =
  (ensureAuth,
  async (req, res) => {
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
          event: event, image: req.user.image
        });
      }
    } catch (error) {
      console.error(error);
      res.render("error/500");
    }
  });

exports.update_event = [
  ensureAuth,
  validateEvent,
  async (req, res) => {
    const existingEvent = await Event.findById(req.params.id).lean();
    try {
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
    } catch (error) {
      if (error.name === "ValidationError") {
        const errors = Object.values(error.errors).map((e) => e.message);
        return res.render("events/edit", {
          errors,
          formData: req.body,
          event: existingEvent,
          image: req.user.image
        });
      }
      console.error(error);
      res.render("error/500");
    }
  },
];

exports.delete_event =
  (ensureAuth,
  async (req, res) => {
    try {
      let event = await Event.findById(req.params.id).lean();

      if (!event) {
        return res.render("error/404");
      }

      if (event.user != req.user.id) {
        res.redirect("/events");
      } else {
        await Event.deleteOne({ _id: req.params.id });
        res.redirect("/dashboard");
      }
    } catch (error) {
      console.error(error);
      return res.render("error/500");
    }
  });

exports.user_event =
  (ensureAuth,
  async (req, res) => {
    try {
      const events = await Event.find({
        user: req.params.userid,
        status: "public",
      })
        .populate("user")
        .lean();

      res.render("events/allevents", {
        events, image: req.user.image
      });
    } catch (error) {
      console.error(error);
      return res.render("error/500");
    }
  });
