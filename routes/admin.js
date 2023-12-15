const express = require("express");
const router = express.Router();
const upload = require('../config/multer');
const adminController = require('../controllers/adminController');
const { isAdmin } = require("../controllers/authController");

// Admin Dashboard
router.get('/dashboard', isAdmin, adminController.dashboard);

// Update profile
router.post('/dashboard', isAdmin, adminController.update_profile);

// Change profile picture
router.post('/dashboard/change-picture', isAdmin, upload.single('image'), adminController.changeProfilePicture);

// Delete profile picture
router.post('/dashboard/delete-picture', isAdmin, adminController.deleteProfilePicture);

// Manage Events
router.get("/manage-events", isAdmin, adminController.manage_events);

// Show add event page
router.get("/events/add", isAdmin, adminController.add_event);

// Process add event form
router.post("/events", isAdmin, adminController.process_add);

// Show all event page
router.get("/events", isAdmin, adminController.show_all_events);

// View event full detail
router.get("/event/:id", isAdmin, adminController.view_event);

// Edit event page
router.get("/events/edit/:id", isAdmin, adminController.edit_eventpage);

// Update event
router.put("/events/:id", isAdmin, adminController.update_event);

// Delete event
router.delete("/event/:id", isAdmin, adminController.delete_event);

// Get Events created by a user
router.get("/user/:userid", isAdmin, adminController.user_event);

// manage users
router.get('/manage-users', isAdmin, adminController.manageUsers);

// View user update page
router.get('/users/update/:id', isAdmin, adminController.editUser)

// Update user
router.post('/users/update/:id', isAdmin, adminController.updateUser);

// Delete users
router.delete('/users/delete/:id', isAdmin, adminController.deleteUser);

module.exports = router;