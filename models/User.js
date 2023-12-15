const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    googleId: {
        type: String,
    },
    displayName: {
        type: String,
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,  
        lowercase: true
    },
    password: {
        type: String,
        required: function() {
            // Only required if the user is not authenticated via Google
            return !this.googleId;
        }
    },
    image: {
        type: String,
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user',
      },
      phone: {
        type: String,
      },
      highestDegree: {
        type: String,
      },
      bio: {
        type: String,
      },
    createdAt: {
        type: Date,
        default: Date.now
    },
    lastSeen: {
        type: Date,
        default: Date.now,
      },

})


UserSchema.virtual('numberOfEvents', {
    ref: 'Event', // reference to the Event model
    localField: '_id', // user's ID field
    foreignField: 'user', // field in the Event model that references the user
    count: true // get the count of matching documents
  });


module.exports = mongoose.model('User', UserSchema)