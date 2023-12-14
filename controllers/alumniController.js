const fs = require("fs");
const path = require("path");
const upload = require("../config/multer");
const User = require("../models/User");

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
      res.redirect("/dashboard"); // Redirect to the dashboard
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
      res.redirect("/dashboard"); // Redirect to the dashboard
    } catch (err) {
      console.error(err);
      res.render("error/500");
    }
  };
  