const express = require("express")
const router = express.Router()
const upload = require('../config/multer');
const eventController = require('../controllers/eventController')
const uploadSingle = upload.single('eventImage');
const adminController = require('../controllers/adminController');
const { isAdmin } = require("../controllers/authController");

// Admin Dashboard
router.get('/dashboard', isAdmin, adminController.dashboard);

// Update profile
router.post('/dashboard', isAdmin, adminController.update_profile);

// Manage Events
router.get("/manage-events", isAdmin, adminController.manage_events);

// Show add event page
router.get("/events/add", isAdmin, adminController.add_event);

// Process add event form
router.post("/events", isAdmin, adminController.process_add);

// Show all event page
router.get("/events", isAdmin, adminController.show_all_events);

// View event full detail
router.get("/event/:id", isAdmin, eventController.view_event);

// Edit event page
router.get("/events/edit/:id", isAdmin, adminController.edit_eventpage);

// Update event
router.put("/events/:id", isAdmin, adminController.update_event);

// Delete event
router.delete("/event/:id", isAdmin, adminController.delete_event);

// Get Events created by a user
router.get("/user/:userid", isAdmin, eventController.user_event);

// Change profile picture
router.post('/dashboard/change-picture', isAdmin, upload.single('image'), adminController.changeProfilePicture);

// Delete profile picture
router.post('/dashboard/delete-picture', isAdmin, adminController.deleteProfilePicture);

module.exports = router;