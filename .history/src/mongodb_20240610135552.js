const mongoose = require("mongoose");

// Retrieve MongoDB connection URI from environment variable
const mongoURI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/MakeMyWork";

mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error);
  });


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
      type: String, // Assuming that we will store image URLs as strings
    }],
    taskOwner: {
      type: String,
      required: true
    }
});

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true // Ensure username is unique
  },
  password: {
    type: String,
    required: true
  }
});

const messageSchema = new mongoose.Schema({
  taskId: { type: mongoose.Schema.Types.ObjectId, ref: 'Task' },
  sender: String,
  message: String,
  
  dateTime: { type: Date, default: Date.now },
});

// Create and export the Task model
const Task = mongoose.model('Task', taskSchema);

// Create and export the User model
const User = mongoose.model('User', userSchema);

const Message = mongoose.model('Message', messageSchema);

module.exports = { User, Task, Message };