const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/ToLearn")
.then(() => {
    console.log("MongoDB connected");
})
.catch((error) => {
    console.error("MongoDB connection error:", error);
});

const loginSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
});

const Login = mongoose.model("Login", loginSchema);

module.exports = Login;
