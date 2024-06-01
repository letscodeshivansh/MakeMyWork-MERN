const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const path = require("path");
const collection = require("./mongodb");
const multer = require("multer");

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const parentDir = path.join(__dirname, '../'); // Parent directory

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Set the views directory
app.set("views", path.join(parentDir, "templates"));

// Serve static files (CSS, JS, images, etc.)
app.use(express.static(path.join(parentDir, "public")));
app.use(express.static(path.join(parentDir, "assets")));

// Routes
app.get("/", (req, res) => {
    res.sendFile(path.join(parentDir, "templates", "index.html"));
});

// For login
app.get("/login.html", (req, res) => {
    res.sendFile(path.join(parentDir, "templates", "login.html"));
});

// For sign up 
app.get("/signup.html", (req, res) => {
    res.sendFile(path.join(parentDir, "templates", "signup.html"));
});

// For posting work
app.get("/postwork.html", (req, res) => {
    res.sendFile(path.join(parentDir, "templates", "postwork.html"));
});

// Serve the chat.html file
app.get("/chat.html", (req, res) => {
    res.sendFile(path.join(parentDir, "templates", "chat.html"));
});

// Serve the chat.js file
app.get("/chat.js", (req, res) => {
    res.sendFile(path.join(__dirname, "chat.js"));
});

// Socket.io events
io.on("connection", (socket) => {
    console.log("A user connected");

    socket.on("disconnect", () => {
        console.log("User disconnected");
    });

    // Listen for messages
    socket.on("chat message", (message) => {
        // Broadcast the message to all connected clients
        io.emit("chat message", message);
    });
});



//restoring the data of new user
app.post("/signup", async (req, res) => {
    try {
        const data = {
            floatingInput: req.body.floatingInput,
            floatingPassword: req.body.floatingPassword
        };

        await collection.insertMany(data);
        
        res.sendFile(path.join(parentDir, "templates", "index.html"));
    } catch (error) {
        res.status(500).send("Error signing up");
    }
});


//checking password and email for login 
app.post("/login", async (req, res) => {
    try {
        const check = await collection.findOne({ floatingInput: req.body.floatingInput });

        if (check.floatingPassword === req.body.floatingPassword) {
            res.sendFile(path.join(parentDir, "templates", "index.html"));
        } else {
            res.send("Wrong Password");
        }
    } catch (error) {
        res.status(500).send("Error logging in");
    }
});


//storing the details of task into the database file name "MakeMyWork/task"
// Multer configuration for handling file uploads

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(parentDir, 'MakeMyTrip-', 'uploads'));
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});

// Multer upload instance
const upload = multer({ storage: storage });

// Handle POST request to '/postwork' for adding a task
app.post("/postwork", upload.array('images', 5), async (req, res) => {
    try {
        const { title, description, deadline, price } = req.body;
        
        // Get the URLs of uploaded images
        const imageUrls = req.files.map(file => '/uploads/' + file.filename);

        // Create a new task with the provided data
        const task = new collection({
            title,
            description,
            deadline,
            price,
            images: imageUrls
        });

        // Save the task to the database
        await task.save();
        
        res.send("Task added successfully");
    } catch (error) {
        res.status(500).send("Error adding task");
    }
});

// Serve uploaded files statically


const port = 6969;
server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});


//hello get to the next step