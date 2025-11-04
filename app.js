const express = require('express');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const path = require('path');

dotenv.config();

const connectDB = require("./config");
connectDB();

const app = express();

app.set('view engine', 'ejs');

app.use(cookieParser());
app.use(express.json());  
app.use(express.urlencoded({ extended: true }));  


app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));  


const adminRouter = require('./routes/admin.routes');
const userRouter = require('./routes/user.routes');
const homeRoutes = require('./routes/home.routes');

app.use('/', homeRoutes);
app.use('/user', userRouter);
app.use('/admin', adminRouter);

const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
    console.log(`🌐 Access your app at: http://localhost:${PORT}`);
}).on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.error(`❌ Port ${PORT} is already in use.`);
        console.error(`💡 Try: kill the process using port ${PORT} or change PORT in .env file`);
        process.exit(1);
    } else {
        console.error('❌ Server error:', err);
        process.exit(1);
    }
});
