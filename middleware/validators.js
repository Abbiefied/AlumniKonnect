const { body, validationResult } = require('express-validator');

exports.validateEvent = (req, res, next) => {
  body('title').notEmpty().withMessage('Title is required');
  body('category').notEmpty().withMessage('Category is required');
  body('status').notEmpty().withMessage('Status is required');
  body('eventImage').notEmpty().withMessage('Event image is required');
  body('location').notEmpty().withMessage('Location is required');
  body('eventDate').notEmpty().withMessage('Event date is required');
  body('description').notEmpty().withMessage('Description is required');
  body('details').notEmpty().withMessage('Details is required');

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const isEdit = req.url.includes('edit'); // Check if it's an edit request
    const page = isEdit ? 'events/edit' : 'events/add';
    return res.render(page, { errors: errors.array() });
  }

  next(); // Proceed to the next middleware or route handler
};

