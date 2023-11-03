const mongoose = require('mongoose')

const EventSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Title is required'],
        trim: true
    },
    category: {
        type: String,
        required: [true, 'Category is required']
    },
    status: {
        type: String,
        default: 'private',
        enum: ['public', 'private']
    },
    description: {
        type: String,
        required: [true, 'Description is required']
    },
    details: {
        type: String,
        required: [true, 'Details is required']
    },
    location: {
        type: String,
        required: [true, 'Location is required']
    },
    eventDate: {
        type: Date,
        required: [true, 'Date is required']
    },
    eventImage:{
        type: String,
        required: [true, 'Event image is required']
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    createdAt: {
        type: Date,
        default: Date.now
    }

})

module.exports = mongoose.model('Event', EventSchema)