const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: "fname required"
    },
    lastName: {
        type: String,
        required: "lname required"
    },
    age: {
        type: Number,
        required: "age required"
    },
    email: {
        type: String,
        required: "email required",
        unique: true,
        validate: {
            validator: function (v) {
                return /^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/.test(v);
            },
            message: "Please enter a valid email"
        }
    },
    profileImage: {
        type: String,
        required: "image is required",
    },
    password: {
        type: String,
        required: true

    },
    age: {
        type: Number,
        required: "age required"
    },
    profileImage: {
        type: String,
        required: "image is required",
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: null
    },
    deletedAt: {
        type: Date
    },
    isDeleted: {
        type: Boolean,
        default: false
    }

}, { timestamps: true });

module.exports = mongoose.model('userProfile', userSchema)