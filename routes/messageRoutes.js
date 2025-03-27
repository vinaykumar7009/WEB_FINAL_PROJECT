const express = require('express');
const router = express.Router();
const Message = require('../models/Message');

// Submit a new message
router.post('/submit', async (req, res) => {
    try {
        const { name, email, department, message } = req.body;
        
        // Create new message
        const newMessage = new Message({
            name,
            email,
            department,
            message
        });

        // Save message to database
        await newMessage.save();

        res.status(201).json({ 
            success: true, 
            message: 'Message sent successfully!' 
        });
    } catch (error) {
        console.error('Error submitting message:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error sending message. Please try again.' 
        });
    }
});

// Get all messages (for admin panel)
router.get('/all', async (req, res) => {
    try {
        const messages = await Message.find().sort({ createdAt: -1 });
        res.status(200).json(messages);
    } catch (error) {
        console.error('Error fetching messages:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error fetching messages' 
        });
    }
});

module.exports = router; 