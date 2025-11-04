const express = require('express');
const router = express.Router();

// Render the homepage
router.get('/', (req, res) => {
    res.render('homepage');
});

// Handle register complaint page (redirect to user routes)
router.get('/complain', (req, res) => {
    res.redirect('/user/complain_form');
});

module.exports = router;
