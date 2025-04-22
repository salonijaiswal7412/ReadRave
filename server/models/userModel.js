const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const validator = require('validator');

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

// Static signup method
userSchema.statics.signup = async function (name, email, password) {
    // Validation
    if (!name || !email || !password) {
        throw Error('All fields must be filled');
    }

    if (!validator.isAlpha(name.replace(/\s/g, ''))) {
        throw Error('Name is invalid');
    }

    if (!validator.isEmail(email)) {
        throw Error('Email is invalid');
    }

    if (!validator.isStrongPassword(password)) {
        throw Error('Password not strong enough');
    }

    // Check if email already exists
    const exists = await this.findOne({ email });
    if (exists) {
        throw Error('Email already exists');
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = await this.create({ name, email, password: hashedPassword });
    return user;
};

// Static login function
userSchema.statics.login = async function (email, password) {
   
    if (!email || !password) {
        throw Error('All fields must be filled');
    }

    // Check if user exists
    const user = await this.findOne({ email });
    if (!user) {
        throw Error('Email does not exist, signup to get started');
    }

    // Check password match
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
        throw Error('Incorrect Password');
    }

    // Return user (you can add a JWT token here if you like)
    return user;
};

module.exports = mongoose.model('User', userSchema);
