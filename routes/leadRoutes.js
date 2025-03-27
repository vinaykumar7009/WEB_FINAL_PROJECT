const express = require('express');
const router = express.Router();
const Lead = require('../models/Lead');

// Middleware to check authentication
const requireLogin = (req, res, next) => {
    if (req.session.loggedIn) {
        next();
    } else {
        res.redirect('/login');
    }
};

// Submit a new lead
router.post('/submit', async (req, res) => {
    try {
        const { 
            firstName, 
            lastName, 
            gender,
            email, 
            phone, 
            address,
            service, 
            message 
        } = req.body;
        
        // Create new lead
        const newLead = new Lead({
            firstName,
            lastName,
            gender,
            email,
            phone,
            address,
            service,
            message
        });

        // Save lead to database
        await newLead.save();

        // Send email notification (you can implement this later)
        // await sendLeadNotification(newLead);

        res.status(201).json({ 
            success: true, 
            message: 'Lead submitted successfully!' 
        });
    } catch (error) {
        console.error('Error submitting lead:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error submitting lead. Please try again.' 
        });
    }
});

// Get all leads (protected route for admin)
router.get('/all', requireLogin, async (req, res) => {
    try {
        const leads = await Lead.find().sort({ createdAt: -1 });
        res.status(200).json(leads);
    } catch (error) {
        console.error('Error fetching leads:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error fetching leads' 
        });
    }
});

// Get single lead
router.get('/:id', requireLogin, async (req, res) => {
    try {
        const lead = await Lead.findById(req.params.id);
        if (!lead) {
            return res.status(404).json({ 
                success: false, 
                message: 'Lead not found' 
            });
        }
        res.status(200).json(lead);
    } catch (error) {
        console.error('Error fetching lead:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error fetching lead' 
        });
    }
});

// Update lead status
router.put('/:id/status', requireLogin, async (req, res) => {
    try {
        const { status } = req.body;
        const lead = await Lead.findByIdAndUpdate(
            req.params.id,
            { 
                status,
                lastContactedAt: Date.now()
            },
            { new: true }
        );
        res.status(200).json(lead);
    } catch (error) {
        console.error('Error updating lead:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error updating lead' 
        });
    }
});

// Add note to lead
router.post('/:id/notes', requireLogin, async (req, res) => {
    try {
        const { text } = req.body;
        const lead = await Lead.findByIdAndUpdate(
            req.params.id,
            { 
                $push: { 
                    notes: { text } 
                }
            },
            { new: true }
        );
        res.status(200).json(lead);
    } catch (error) {
        console.error('Error adding note:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error adding note' 
        });
    }
});

module.exports = router; 