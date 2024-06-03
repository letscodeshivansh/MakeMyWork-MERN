const mongoose = require("mongoose");

// Retrieve MongoDB connection URI from environment variable
const mongoURI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/MakeMyWork";

mongoose.connect(process.env.MONGODB_URI);

mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error);
  });

module.exports = mongoose.connection; // Export the connection object for other modules to use

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  deadline: {
    type: Date,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  images: [{
    type: String  // Assuming that we will store image URLs as strings
  }]
});

const SignUpInfoSchema = new mongoose.Schema({
    floatingInput: {
        type: String,
        required: true
    },
    floatingPassword: {
        type: String,
        required: true
    }
});

//for storing the task 
const Task = mongoose.model('Task', taskSchema);

//for storing the login informations 
const SignUpInfo = mongoose.model("SignUpInfo", SignUpInfoSchema);

module.exports = { Task, SignUpInfo };
