const express = require('express');
const router = express.Router();

// Render the homepage
router.get('/', (req, res) => {
    res.render('homepage');
});

// Render the admin login page
router.get('/admin/login', (req, res) => {
    const isAdminRegistered = false; 

    if (isAdminRegistered) {
        res.redirect('/admin/dashboard');
    } else {
        res.render('adminLogin', { isAdminRegistered });
    }
});

// Render the admin registration page
router.get('/admin/register', (req, res) => {
    res.render('adminRegister');
});

// Handle form submission for admin login
router.post('/admin/login', (req, res) => {
    const { username, password } = req.body;
    if (username === 'admin' && password === 'password123') {
        res.redirect('/admin/dashboard');
    } else {
        res.render('adminLogin', { errorMessage: 'Invalid username or password.' });
    }
});

// Render the admin dashboard page
router.get('/admin/dashboard', (req, res) => {
    res.render('adminDashboard');
});

// Handle register complaint page
router.get('/complain', (req, res) => {
    res.render('complain');
});

// Handle staff login page
router.get('/staff/login', (req, res) => {
    res.render('staffLogin');
});

module.exports = router;
