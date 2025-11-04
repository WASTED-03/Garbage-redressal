const express = require('express');
const router = express.Router();
const Admin = require('../models/admin.model');
const Complain = require('../models/complaint.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const authMiddleware = require('../middlewares/authMiddleware');

// Admin Registration Page
router.get('/register', (req, res) => {
    res.render('adminregister');
});

// Admin Login Page
router.get('/login', (req, res) => {
    res.render('adminlogin');
});

// Admin Registration
router.post('/register', async (req, res) => {
    try {
        const { adminname, email, password } = req.body;
        const existingAdmin = await Admin.findOne({ $or: [{ adminname }, { email }] });

        if (existingAdmin) {
            return res.status(409).render('adminregister', { error: 'Admin already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const admin = new Admin({ 
            adminname, 
            email, 
            password: hashedPassword
        });

        await admin.save();
        res.redirect('/admin/login');
    } catch (error) {
        res.status(500).render('adminregister', { error: 'Registration failed' });
    }
});

// Admin Login
router.post('/login', async (req, res) => {
    try {
        const { adminname, password } = req.body;
        const admin = await Admin.findOne({ adminname });

        if (!admin) {
            return res.status(401).render('adminlogin', { error: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
            return res.status(401).render('adminlogin', { error: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { adminId: admin._id, adminname: admin.adminname },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.cookie('adminToken', token, { 
            httpOnly: true,
            maxAge: 3600000 // 1 hour
        });

        res.redirect('/admin/complaints');
    } catch (error) {
        res.status(500).render('adminlogin', { error: 'Login failed' });
    }
});

// View Complaints (No Authentication Required)
router.get('/complaints', async (req, res) => {
    try {
        const complaints = await Complain.find().lean();
        res.render('complaints', { data: complaints });

    } catch (error) {
        res.status(500).render('error', { error: 'Failed to load complaints' });
    }
});

// Update Complaint Status (Admin Only)
router.post('/complaints/:id/status', authMiddleware, async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const validStatuses = ['pending', 'in-progress', 'completed'];

        if (!validStatuses.includes(status)) {
            return res.status(400).json({ error: 'Invalid status value' });
        }

        const updatedComplaint = await Complain.findByIdAndUpdate(
            id,
            { status, updatedBy: req.admin._id },
            { new: true, runValidators: true }
        );

        if (!updatedComplaint) {
            return res.status(404).json({ error: 'Complaint not found' });
        }

        res.redirect('/admin/complaints');
    } catch (error) {
        res.status(500).json({ error: 'Update failed' });
    }
});

// Admin Logout
router.get('/logout', (req, res) => {
    res.clearCookie('adminToken');
    res.redirect('/admin/login');
});

module.exports = router;
