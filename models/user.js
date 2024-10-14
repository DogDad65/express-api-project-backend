// models/user.js

const mongoose = require("mongoose");
const { postSchema } = require("./pinsta");

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required: true
    },

    hashedPassword: {
        type: String,
        required: true
    },
    posts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
    }], avatar: {
        type: String,
    },
}, { timestamps: true }); // Adds createdAt and updatedAt fields


// Remove password field from JSON output for security
userSchema.set("toJSON", {
    transform: (document, returnedObject) => {
        delete returnedObject.hashedPassword;
    },
});

module.exports = mongoose.model("User", userSchema);