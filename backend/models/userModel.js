const { Timestamp } = require("mongodb");
const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please Add a name"],
  },
  email: {
    type: String,
    required: [true, "Please Add a email"],
    unique: true,
    trim: true,
    match: [
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      "Please enter a valid email"
    ],
    },
    password: {
        type: String,
        required: [true, "Please add a Password"],
        minLength: [6, "Password Word Must be greater than 6 characters"],
        maxLength: [23, "Must not be more than 23 characters"]
    },
    phone: {
        type: String,
        default: "+923"
    },
    bio: {
        type: String,
        maxLenth: [250, "Bio must not be more than 50 characters"],
        default: "bio"
    }
}, {
    timestamps: true 
});

const User = mongoose.model("User", userSchema);
module.exports = User;
