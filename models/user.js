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
  images: [postSchema], // Embedded posts associated with the user
  avatar: {
    type: String,
  },
}, { timestamps: true }); // Adds createdAt and updatedAt fields


// Remove password field from JSON output for security
userSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    delete returnedObject.password;
  },
});

module.exports = mongoose.model("User", userSchema);
