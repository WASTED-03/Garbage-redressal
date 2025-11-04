const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');
const Admin = require('./models/admin.model');

dotenv.config();

async function seedAdmin() {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        // Check if admin already exists
        const existingAdmin = await Admin.findOne({ adminname: 'admin' });
        if (existingAdmin) {
            console.log('Admin already exists. Skipping seed.');
            await mongoose.connection.close();
            return;
        }

        // Create default admin
        const hashedPassword = await bcrypt.hash('admin123', 10);
        const admin = new Admin({
            adminname: 'admin',
            email: 'admin@garbageredressal.com',
            password: hashedPassword
        });

        await admin.save();
        console.log('✅ Default admin created successfully!');
        console.log('Admin ID: admin');
        console.log('Password: admin123');
        console.log('Email: admin@garbageredressal.com');
        
        await mongoose.connection.close();
        process.exit(0);
    } catch (error) {
        console.error('Error seeding admin:', error);
        await mongoose.connection.close();
        process.exit(1);
    }
}

seedAdmin();

