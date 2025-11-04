const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const userModel = require('../models/user.model.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Complain = require('../models/complaint.model.js'); 
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const FileInfo = require('../models/garbageimg.model.js'); 
const authmiddleware = require('../middlewares/auth');

const uploadFolder = './uploads';

// Ensure upload folder exists
if (!fs.existsSync(uploadFolder)) {
  fs.mkdirSync(uploadFolder, { recursive: true });
}

// Multer Storage Configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadFolder);
  },
  filename: function (req, file, cb) {
    const userId = req.user ? req.user.userId : 'anonymous';
    const timestamp = Date.now(); // Unique timestamp
    const extension = path.extname(file.originalname);
    const filename = `${userId}-${timestamp}${extension}`;
    cb(null, filename);
  },
});

const upload = multer({ storage: storage });

// ✅ Login Routes
router.get('/login', (req, res) => {
  res.render('login');
});

router.post('/login',
  body('username').trim().isLength({ min: 3 }),
  body('password').trim().isLength({ min: 5 }),
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array(), message: "Invalid data" });
    }

    const { username, password } = req.body;
    const user = await userModel.findOne({ username });

    if (!user) {
      return res.status(400).json({ message: "Username or password is incorrect" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Username or password is incorrect" });
    }

    const token = jwt.sign({
      userId: user._id,
      email: user.email,
      username: user.username,
    }, process.env.JWT_SECRET);

    res.cookie('token', token);
    res.redirect('./complain_form');
  }
);

// ✅ Register Routes
router.get('/register', (req, res) => {
  res.render('register');
});

router.post('/register',
  body('email').trim().isEmail().isLength({ min: 13 }),
  body('password').trim().isLength({ min: 5 }),
  body('username').trim().isLength({ min: 3 }),
  async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array(), message: 'Invalid data' });
    }

    const { email, username, password } = req.body;
    const hashPassword = await bcrypt.hash(password, 12);

    try {
      const newUser = await userModel.create({ username, email, password: hashPassword });
      res.redirect('./login');
    } catch (error) {
      console.error('Error creating user:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }
);

// ✅ Complaint Form Route (GET)
router.get('/complain_form', authmiddleware, (req, res) => {
  res.render('complain_form');
});

// ✅ Complaint Submission Route (POST)
router.post('/complains', authmiddleware, upload.single('image'), async (req, res) => {
  console.log("Received Request Body:", req.body); // ✅ Log form data
  console.log("Received File Data:", req.file); // ✅ Log uploaded file

  try {
    const { first_name, last_name, phone, address, complain } = req.body;

    // Validate required fields
    if (!first_name || !last_name || !phone || !address || !complain) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const imagePath = req.file ? req.file.path : null;
    const imageFilename = req.file ? req.file.filename : null;

    // ✅ Save File Info (if image uploaded)
    if (imagePath) {
      await FileInfo.create({
        file_uploaded_by: req.user.username,
        user_id: req.user.userId,
        filename: imageFilename,
        path: imagePath,
        mimetype: req.file.mimetype,
        size: req.file.size,
      });
    }

    // ✅ Save Complaint in Database
    const newComplain = new Complain({
      first_name,
      last_name,
      phone,
      address,
      complain,
      image: imageFilename, 
      image_address: address,
    });

    await newComplain.save();
    res.redirect('./complainsubmission');
  } catch (error) {
    console.error('Error submitting complaint:', error);
    res.status(500).json({ error: 'Failed to submit complaint' });
  }
});

// ✅ Complaint Submission Confirmation Page
router.get('/complainsubmission', (req, res) => {
  res.render('complainsubmission');
});

module.exports = router;