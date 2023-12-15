const fs = require('fs');
const path = require('path');
const upload = require("../config/multer");
const Event = require("../models/Event");
const { ensureAuth, isAdmin } = require("./authController");
const { validateEvent } = require("../middleware/validators");

const uploadSingle = upload.single("eventImage");

exports.add_event =
  (ensureAuth,
  (req, res) => {
    res.render("events/add", { errors: [], image: req.user.image });
  });

//process add form
exports.process_add = [
  ensureAuth,
  uploadSingle,
  validateEvent,
  async (req, res) => {
    try {
      req.body.user = req.user.id;
      req.body.eventImage = req.file.filename;

      await Event.create(req.body);
      req.flash('success_msg', 'Event created successfully!');
      res.redirect("/dashboard");
    } catch (error) {
      if (error.name === "ValidationError") {
        const errors = Object.values(error.errors).map((e) => e.message);
        return res.render("events/add", {
          errors,
          formData: req.body,
          image: req.user.image,
        });
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
        events,
        image: req.user.image,
      });
    } catch (error) {
      console.error(error);
      res.render("/error/500");
    }
  });


// View more details about an event
exports.view_event =
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
          event,
          image: req.user.image,
        });
      }
    } catch (error) {
      console.error(error);
      res.render("error/404");
    }
  });

// View edit event page
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
        const eventDate = event.eventDate.toISOString().split("T")[0];
      
        res.render("events/edit", {
          event: event,
          eventDate: eventDate,
          eventImage: `/uploads/${event.eventImage}`,
          image: req.user.image,
        });
      }
    } catch (error) {
      console.error(error);
      res.render("error/500");
    }
  });

// Update event
exports.update_event = [
  ensureAuth,
  uploadSingle, // Multer middleware for file upload
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

      let updatedEventData = {
        title: req.body.title,
        description: req.body.description,
        category: req.body.category,
        status: req.body.status,
        details: req.body.details,
        location: req.body.location,
        eventDate: req.body.eventDate,
      };

      if (req.file) {
        // If a new file is uploaded, remove the old one
        if (existingEvent.eventImage) {
          fs.unlinkSync(
            path.join(__dirname, "../public/uploads/", existingEvent.eventImage)
          );
        }
        updatedEventData.eventImage = req.file.filename;
      }

      const updatedEvent = await Event.findOneAndUpdate(
        { _id: req.params.id },
        updatedEventData,
        { new: true, runValidators: true }
      );
      req.flash('success_msg', 'Event updated successfully!');
      res.redirect("/dashboard");
    } catch (error) {
      if (error.name === "ValidationError") {
        const errors = Object.values(error.errors).map((e) => e.message);
        return res.render("events/edit", {
          errors,
          formData: req.body,
          event: existingEvent,
          image: req.user.image,
        });
      }
      console.error(error);
      res.render("error/500");
    }
  },
];

// Delete event
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
        if (event.eventImage) {
          fs.unlinkSync(path.join(__dirname, '../public/uploads/', event.eventImage));
        }
        await Event.deleteOne({ _id: req.params.id });
        req.flash('success_msg', 'Event deleted successfully!')
        res.redirect("/dashboard");
      }
    } catch (error) {
      console.error(error);
      return res.render("error/500");
    }
  });

// Events by a particular user
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
        events,
        image: req.user.image,
      });
    } catch (error) {
      console.error(error);
      return res.render("error/500");
    }
  });