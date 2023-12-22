const express = require("express")
const router = express.Router()
const upload = require('../config/multer');
const alumniController = require('../controllers/alumniController');
const { ensureAuth, isAdmin } = require("../controllers/authController");

// Alumni Dashboard
router.get("/dashboard", ensureAuth, alumniController.alumniDashboard);

// Update Alumni profile information
router.post('/dashboard', ensureAuth, alumniController.updateProfile);

// Change profile picture
router.post('/dashboard/change-picture', ensureAuth, upload.single('image'), alumniController.changeProfilePicture);

// Delete profile picture
router.post('/dashboard/delete-picture', ensureAuth, alumniController.deleteProfilePicture);

module.exports = router;