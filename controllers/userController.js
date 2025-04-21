const { log } = require('console');
const userModel = require('../models/userModel');
const User = require('../schema/userSchema')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).send('Username and password are required');
    }

    try {
        const user = await User.findOne({ email: email });

        if (!user) {
            return res.status(401).send('Invalid username or password');
        }

        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            return res.status(401).send('Invalid username or password');
        }

        const token = await userModel.generateAuthToken();

        res.setHeader('Access-Control-Expose-Headers', 'Authorization');
        res.setHeader('Authorization', `Bearer ${token}`);

        res.status(200).send({
            message: 'Login successful',
        });
    } catch (error) {
        console.error('Error in login:', error); 
        res.status(500).send('Internal Server Error');
    }
};

const Inscription = async (req, res) => {
    const { users, email, password } = req.body;

    if (!users || !email || !password) {
        return res.status(400).send('Username, email, and password are required');
    }

    try {
        const existingUser = await User.findOne({ email: email });

        if (existingUser) {
            return res.status(400).send('User with this username or email already exists');
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({ username: users, email: email, password: hashedPassword });
        await newUser.save();

        const token = jwt.sign({ userId: newUser._id }, 'your-secret-key', { expiresIn: '1h' });

        res.setHeader('Access-Control-Expose-Headers', 'Authorization');
        res.setHeader('Authorization', `Bearer ${token}`);

        res.status(201).send({
            message: 'Registration successful',
        });
    } catch (error) {
        console.error('Error in Inscription:', error); 
        res.status(500).send('Internal Server Error');
    }
};



module.exports = {
    login,
    Inscription,
    
};