require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const session = require('express-session');
const app = express();
const appointmentRoutes = require('./routes/appointmentRoutes');
const messageRoutes = require('./routes/messageRoutes');
const leadRoutes = require('./routes/leadRoutes');

// Session Configuration
app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Set to true if using HTTPS
}));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('MongoDB connection error:', err));

// Define Schema and Model
const dataSchema = new mongoose.Schema({
    name: String,
    email: String,
    drName: String,
    department: String,
    appointmentDate: Date,
    appointmentTime: String
});

const Data = mongoose.model('hello', dataSchema);

// Feedback Schema
const feedbackSchema = new mongoose.Schema({
    name: String,
    email: String,
    rating: Number,
    message: String,
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Feedback = mongoose.model('feedback', feedbackSchema);

// Login Credentials
const validCredentials = {
    username: 'vinay',
    password: 'vinaypassword'
};

// Middleware to check authentication
const requireLogin = (req, res, next) => {
    if (req.session.loggedIn) {
        next();
    } else {
        res.redirect('/login');
    }
};

// Routes
app.get('/', (req, res) => {
    res.render('home');
});

app.get('/login', (req, res) => {
    res.render('login', { error: null });
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;
    if (username === validCredentials.username && password === validCredentials.password) {
        req.session.loggedIn = true;
        res.redirect('/dashboard');
    } else {
        res.render('login', { error: 'Invalid credentials' });
    }
});

app.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
});

// Protected Routes
app.get('/dashboard', requireLogin, async (req, res) => {
    const data = await Data.find();
    res.render('index', { data });
});

app.get('/leads', requireLogin, async (req, res) => {
    res.render('leads');
});

app.get('/create', requireLogin, (req, res) => {
    res.render('create');
});

app.post('/create', requireLogin, async (req, res) => {
    const newData = new Data({
        name: req.body.name,
        email: req.body.email,
        drName: req.body.drName,
        department: req.body.department,
        appointmentDate: req.body.appointmentDate,
        appointmentTime: req.body.appointmentTime
    });
    await newData.save();
    res.redirect('/dashboard');
});

app.get('/edit/:id', requireLogin, async (req, res) => {
    const data = await Data.findById(req.params.id);
    res.render('edit', { data });
});

app.post('/edit/:id', requireLogin, async (req, res) => {
    await Data.findByIdAndUpdate(req.params.id, {
        name: req.body.name,
        email: req.body.email,
        drName: req.body.drName,
        department: req.body.department,
        appointmentDate: req.body.appointmentDate,
        appointmentTime: req.body.appointmentTime
    });
    res.redirect('/dashboard');
});

app.get('/delete/:id', requireLogin, async (req, res) => {
    await Data.findByIdAndDelete(req.params.id);
    res.redirect('/dashboard');
});

// Feedback Routes
app.get('/feedback', requireLogin, async (req, res) => {
    const feedbacks = await Feedback.find().sort({ createdAt: -1 });
    res.render('feedback', { feedbacks });
});

app.post('/feedback', requireLogin, async (req, res) => {
    const newFeedback = new Feedback({
        name: req.body.name,
        email: req.body.email,
        rating: req.body.rating,
        message: req.body.message
    });
    await newFeedback.save();
    res.redirect('/dashboard');
});

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

app.use('/api/appointments', appointmentRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/leads', leadRoutes);




































