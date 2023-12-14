const express = require("express")
const router = express.Router()
const upload = require('../config/multer');
const eventController = require('../controllers/eventController')
const { ensureAuth } = require('../controllers/authController')
const uploadSingle = upload.single('eventImage');

// Show add event page
router.get("/add", ensureAuth, eventController.add_event);

// Process add event form
router.post("/", ensureAuth, eventController.process_add);

// Show all event page
router.get("/", ensureAuth, eventController.show_events);

// View event full detail
router.get("/:id", ensureAuth, eventController.view_event);

// Edit event page
router.get("/edit/:id", ensureAuth, eventController.edit_eventpage);

// Update event
router.put("/:id", ensureAuth, eventController.update_event);

// Delete event
router.delete("/:id", ensureAuth, eventController.delete_event);

// Get Events created by a user
router.get("/user/:userid", ensureAuth, eventController.user_event);

module.exports = router;
