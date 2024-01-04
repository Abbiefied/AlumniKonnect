const fs = require("fs");
const path = require("path");
const upload = require("../config/multer");
const Event = require("../models/Event");
const User = require("../models/User");
const { isAdmin } = require("./authController");
const { validateEvent } = require("../middleware/validators");

const uploadSingle = upload.single("eventImage");

// Admin Dashboard
exports.dashboard = async (req, res) => {
  try {
    const events = await Event.find({ user: req.user.id }).lean();
    res.render("admin/dashboard", {
      firstName: req.user.firstName,
      lastName: req.user.lastName,
      email: req.user.email,
      image: req.user.image,
      phone: req.user.phone,
      highestDegree: req.user.highestDegree,
      bio: req.user.bio,
      events,
    });
  
  } catch (error) {
    console.error(error);
    res.render("error/500");
  }
};

// Update profile
exports.update_profile =
  (isAdmin,
  async (req, res) => {
    try {
      const { email, phone, highestDegree, bio } = req.body;

      // Update user information
      await User.findByIdAndUpdate(req.user.id, {
        email,
        phone,
        highestDegree,
        bio,
      });
      req.flash('success_msg', 'Profile updated successfully!');
      res.redirect("/admin/dashboard");
    } catch (error) {
      console.error(error);
      res.render("error/500");
    }
  });

// Manage events
exports.manage_events =
  (isAdmin,
  async (req, res) => {
    try {
      const events = await Event.find().lean();
      res.render("admin/manage_events", {
        name: req.user.firstName,
        image: req.user.image,
        events,
      });
    } catch (error) {
      console.error(error);
      res.render("error/500");
    }
  });

//show all events
exports.show_all_events =
  (isAdmin,
  async (req, res) => {
    try {
      const events = await Event.find()
        .populate("user")
        .sort({ createdAt: "desc" })
        .lean();

      res.render("admin/events", {
        events,
        image: req.user.image,
        user: req.user,
        role: req.user.role,
      });
    } catch (error) {
      console.error(error);
      res.render("/error/500");
    }
  });

// Add event page route
exports.add_event =
  (isAdmin,
  (req, res) => {
    res.render("admin/add", { errors: [], image: req.user.image });
  });

//process add form
exports.process_add = [
  isAdmin,
  uploadSingle,
  validateEvent,
  async (req, res) => {
    try {
      req.body.user = req.user.id;
      req.body.eventImage = req.file.filename;

      await Event.create(req.body);
      req.flash('success_msg', 'Event created successfully!');
      res.redirect("/admin/dashboard");
    } catch (error) {
      if (error.name === "ValidationError") {
        const errors = Object.values(error.errors).map((e) => e.message);
        req.flash('error', errors); 
        return res.redirect("/admin/events/add"); 
      }
      console.error(error);
      req.flash('error', 'Internal Server Error');
      res.render("error/500");
    }
  },
];

// View edit event page
exports.edit_eventpage = async (req, res) => {
  try {
    const event = await Event.findOne({
      _id: req.params.id,
    }).lean();

    if (!event) {
      return res.render("error/404");
    }

    const eventDate = event.eventDate.toISOString().split("T")[0];

    res.render("admin/edit", {
      event: event,
      eventDate: eventDate,
      eventImage: `/uploads/${event.eventImage}`,
      image: req.user.image,
    });
  } catch (error) {
    console.error(error);
    res.render("error/500");
  }
};

// Process edit event
exports.update_event = [
  isAdmin,
  uploadSingle,
  validateEvent,
  async (req, res) => {
    const existingEvent = await Event.findById(req.params.id).lean();
    try {
      if (!existingEvent) {
        return res.render("error/404");
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
        // If a new file is uploaded
        if (existingEvent.eventImage) {
          const imagePath = path.join(__dirname, "../public/uploads/", existingEvent.eventImage);

          // Check if the file exists before trying to delete
          if (fs.existsSync(imagePath)) {
            fs.unlinkSync(imagePath);
          }
        }
        updatedEventData.eventImage = req.file.filename;
      }

      const updatedEvent = await Event.findOneAndUpdate(
        { _id: req.params.id },
        updatedEventData,
        { new: true, runValidators: true }
      );
      req.flash('success_msg', 'Event updated successfully!');
      // redirect to dashboard
      res.redirect("/admin/dashboard");
    } catch (error) {
      if (error.name === "ValidationError") {
        const errors = Object.values(error.errors).map((e) => e.message);
        return res.render("admin/edit", {
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
exports.delete_event = async (req, res) => {
    try {
      let event = await Event.findById(req.params.id).lean();

      if (!event) {
        return res.render("error/404");
      }

      if (event.eventImage) {
        const imagePath = path.join(__dirname, '../public/uploads/', event.eventImage);

        // Check if the file exists before trying to delete
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
        }
      }

        await Event.deleteOne({ _id: req.params.id });
        req.flash('success_msg', 'Event deleted successfully!')
        res.redirect("/admin/dashboard");
      }
     catch (error) {
      console.error(error);
      return res.render("error/500");
    }
  };

// View more details about an event
exports.view_event = async (req, res) => {
    try {
      let event = await Event.findById(req.params.id).populate("user").lean();

      if (!event) {
        return res.render("error/404");
      }
        res.render("events/show", {
          event,
          image: req.user.image,
        });
      }
    catch (error) {
      console.error(error);
      res.render("error/404");
    }
  };

// Events by a particular user
exports.user_event = async (req, res) => {
    try {
      const events = await Event.find({
        user: req.params.userid,
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
  };

// Change profile picture
exports.changeProfilePicture = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    // Check if the user has an existing profile picture
    if (user.image) {
      const imagePath = path.join(__dirname, `../public/uploads/${user.image}`);

      // Check if the file exists before trying to delete
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    // Update user's image property in the database with the new file name
    user.image = req.file.filename;
    await user.save();

    req.flash('success_msg', 'Profile picture changed successfully!');
    res.redirect("/admin/dashboard"); // Redirect to the dashboard
  } catch (err) {
    console.error(err);
    res.render("error/500");
  }
};

// Delete profile picture
exports.deleteProfilePicture = async (req, res) => {
  try {
    // Find the user by ID
    const user = await User.findById(req.user.id);

    // Check if the user has an existing profile picture
    if (user.image) {
      const imagePath = path.join(__dirname, `../public/uploads/${user.image}`);

      // Check if the file exists before trying to delete
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }

      // Update user's image property in the database to null
      user.image = null;
      await user.save();
    }
    req.flash('success_msg', 'Profile picture deleted successfully!');
    res.redirect("/admin/dashboard"); // Redirect to the dashboard
  } catch (err) {
    console.error(err);
    res.render("error/500");
  }
};

// Manage users
exports.manageUsers = async (req, res) => {
  try {
    const users = await User.find().populate('numberOfEvents').lean();
    res.render('admin/manageUsers', { users });
  } catch (error) {
    console.error(error);
    res.render('error/500');
  }
};

// View Edit user page
exports.editUser = async (req, res) => {
  try {
    // Fetch user details based on ID
    const user = await User.findById(req.params.id).lean();
    res.render('admin/editUser', { user });
  } catch (error) {
    console.error(error);
    res.render('error/500');
  }
};

// Update user
exports.updateUser = async (req, res, next) => {
  const userId = req.params.id; 
  const { firstName, lastName, email } = req.body;

  try {
    if (req.body._method && req.body._method.toUpperCase() === 'PUT') {
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { firstName, lastName, email },
      { new: true, runValidators: true }
    ).exec();

    if (!updatedUser) {
      req.flash('error_msg', 'User not found');
      return res.redirect('/admin/manage-users');
    }

    req.flash('success_msg', 'User updated successfully');
    res.redirect('/admin/manage-users'); 
  }
  } catch (error) {
    console.error(error);
    req.flash('error_msg', 'Internal Server Error');
    res.redirect('/admin/manage-users'); 
  }
};

// Delete user
exports.deleteUser = async (req, res, next) => {
  const userId = req.params.id;

  try {
    const deletedUser = await User.findByIdAndDelete(userId).exec();

    if (!deletedUser) {
      req.flash('error', 'User not found');
      return res.redirect('/admin/manage-users');
    }

    req.flash('success_msg', 'User deleted successfully!');
    res.redirect('/admin/manage-users');
  } catch (error) {
    console.error(error);
    req.flash('error', 'Internal Server Error');
    res.redirect('/admin/manage-users');
  }
};
