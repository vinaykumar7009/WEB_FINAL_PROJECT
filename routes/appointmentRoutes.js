const express = require('express');
const router = express.Router();

// Placeholder for appointment routes
router.post('/book', async (req, res) => {
    res.status(200).json({ message: 'Appointment booking endpoint' });
});

router.get('/all', async (req, res) => {
    res.status(200).json({ message: 'Get all appointments endpoint' });
});

module.exports = router; 