const mongoose = require('mongoose');

const leadSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true
    },
    firstName: {
        type: String,
        trim: true
    },
    lastName: {
        type: String,
        trim: true
    },
    gender: {
        type: String,
        enum: ['male', 'female', 'other', ''],
        default: ''
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },
    phone: {
        type: String,
        required: true,
        trim: true
    },
    address: {
        type: String,
        trim: true
    },
    service: {
        type: String,
        trim: true
    },
    message: {
        type: String,
        trim: true
    },
    status: {
        type: String,
        enum: ['new', 'contacted', 'qualified', 'converted', 'lost'],
        default: 'new'
    },
    source: {
        type: String,
        default: 'website'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    lastContactedAt: Date,
    notes: [{
        text: String,
        createdAt: {
            type: Date,
            default: Date.now
        }
    }]
});

// Add indexes for frequently queried fields
leadSchema.index({ email: 1 });
leadSchema.index({ status: 1 });
leadSchema.index({ createdAt: -1 });
leadSchema.index({ phone: 1 });
leadSchema.index({ firstName: 1, lastName: 1 });

module.exports = mongoose.model('Lead', leadSchema); 