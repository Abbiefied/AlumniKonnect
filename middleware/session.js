
const User = require('../models/User');

const updateLastSeen = async (req, res, next) => {
  try {
    if (req.user) {
      await User.findByIdAndUpdate(req.user._id, { lastSeen: Date.now() }).exec();
    }
    next();
  } catch (error) {
    console.error(error);
    next(error);
  }
};

module.exports = updateLastSeen;
