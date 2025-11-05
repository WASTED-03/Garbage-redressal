const express = require('express');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const path = require('path');

dotenv.config();

const connectDB = require("./config");
connectDB();

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

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

module.exports = app;
