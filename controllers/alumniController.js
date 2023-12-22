const fs = require("fs");
const path = require("path");
const upload = require("../config/multer");
const User = require("../models/User");
const Event = require("../models/Event")

// Alumni Dashboard page
exports.alumniDashboard = async (req, res) => {
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
    
  } catch (error) {
    console.error(error);
    res.render("error/500");
  }
};

// Update profile information
exports.updateProfile = async (req, res) => {
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
    res.redirect('/alumni/dashboard');
  } catch (error) {
    console.error(error);
    res.render('error/500');
  }
};

// Change profile picture
exports.changeProfilePicture = async (req, res) => {
    try {
      const user = await User.findById(req.user.id);
      // Check if the user has an existing profile picture
      if (user.image) {
        // Delete the old profile picture file
        fs.unlinkSync(path.join(__dirname, `../public/uploads/${user.image}`));
      }
      // Update user's image property in the database with the new file name
      user.image = req.file.filename;
      await user.save();
      req.flash('success_msg', 'Profile picture changed successfully!');
      res.redirect("/alumni/dashboard"); // Redirect to the dashboard
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
        // Delete the profile picture file
        fs.unlinkSync(path.join(__dirname, `../public/uploads/${user.image}`));
  
        // Update user's image property in the database to null
        user.image = null;
        await user.save();
      }
      req.flash('success_msg', 'Profile picture deleted successfully!');
      res.redirect("/alumni/dashboard"); // Redirect to the dashboard
    } catch (err) {
      console.error(err);
      res.render("error/500");
    }
  };
  