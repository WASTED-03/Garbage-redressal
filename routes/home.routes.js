const express = require('express');
const router = express.Router();

// Render the homepage
router.get('/', (req, res) => {
    res.render('homepage');
});

// Render the admin login page (redirect to admin routes)
router.get('/admin/login', (req, res) => {
    res.redirect('/admin/login');
});

// Render the admin registration page (redirect to admin routes)
router.get('/admin/register', (req, res) => {
    res.redirect('/admin/register');
});

// Handle register complaint page (redirect to user routes)
router.get('/complain', (req, res) => {
    res.redirect('/user/complain_form');
});

module.exports = router;
