const express = require("express")
const router = express.Router()
const upload = require('../config/multer');
const eventController = require('../controllers/eventController')
const uploadSingle = upload.single('eventImage');
// Show add event page
router.get("/add", eventController.add_event);

// Process add event form
router.post("/", eventController.process_add);

// Show all event page
router.get("/", eventController.show_events);

// View event full detail
router.get("/:id", eventController.view_events);

// Edit event page
router.get("/edit/:id", eventController.edit_eventpage);

// Update event
router.put("/:id", eventController.update_event);

// Delete event
router.delete("/:id", eventController.delete_event);

// Get Events created by a user
router.get("/user/:userid", eventController.user_event);

module.exports = router;
