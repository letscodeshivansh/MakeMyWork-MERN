const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const path = require("path");
// const collection = require("./mongodb");
const multer = require("multer");
const session = require('express-session');

//adding dotenv file
require('dotenv').config();

//data collection link 
const { Task, User } = require("./mongodb");

//express server
const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const parentDir = path.join(__dirname, '../'); // Parent directory

//using session as storage
app.use(session({
  secret: 'secretkey', 
  resave: false,
  saveUninitialized: true
}));


// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Set the views directory
app.set("views", path.join(parentDir, "templates"));

// Set EJS as the view engine
app.set('view engine', 'ejs');

// Serve static files (CSS, JS, images, etc.)
app.use(express.static(path.join(parentDir, "public")));
app.use(express.static(path.join(parentDir, "assets")));


app.get("/", (req, res) =>{
    res.render("landing")
});

//routes
app.get("/index", async (req, res) => {
    try {
        const tasks = await Task.find(); // Fetch tasks data
        const username = req.session.username; // Access username from session
        res.render("index", { tasks, username }); // Pass data to the template
    } catch (error) {
        console.error("Error fetching tasks:", error.message);
        res.status(500).send("Error fetching tasks");
    }
});


// app.get("/:username", async (req, res) => {
//     const { username } = req.params;
  
//     // Assuming you want to check if the username exists in the database
//     const user = await User.findOne({ username });
  
//     if (!user) {
//       return res.status(404).send("User not found");
//     }
  
//     // Use the username for rendering or processing (optional)
//     res.render("index", { username }); // Example rendering of user page
// });
  
// Serve the chat.html file
app.get("/chat.html", (req, res) => {
    res.sendFile(path.join(parentDir, "templates", "chat.html"));
});

// Serve the chat.js file
app.get("/chat.js", (req, res) => {
    res.sendFile(path.join(__dirname, "chat.js"));
});

// Socket.io events
let socketsConected = new Set()

io.on('connection', onConnected)

function onConnected(socket) {
  console.log('Socket connected', socket.id)
  socketsConected.add(socket.id)
  io.emit('clients-total', socketsConected.size)

  socket.on('disconnect', () => {
    console.log('Socket disconnected', socket.id)
    socketsConected.delete(socket.id)
    io.emit('clients-total', socketsConected.size)
  })

  socket.on('message', (data) => {
    // console.log(data)
    socket.broadcast.emit('chat-message', data)
  })

  socket.on('feedback', (data) => {
    socket.broadcast.emit('feedback', data)
  })
}
  
// Serve the login page
app.get("/login", (req, res) => {
    res.render("login"); // Render the login.ejs file
});
  
// Handle login request
app.post("/login", async (req, res) => {
    try {
        const { username, password } = req.body;

        // Find the user by username and password
        const user = await User.findOne({ username, password });

        if (!user) {
            return res.status(401).render("login", { error: "Invalid username or password" });
        }

        // Store the username in the session
        req.session.username = username;

        // Redirect to main index page
        res.redirect("/index");
    } catch (error) {
        console.error(error);
        res.status(500).send("Error logging in");
    }
});

// Render the signup page
app.get("/signup", (req, res) => {
    res.render("signup"); 
});

// Handle signup request
app.post("/signup", async (req, res) => {
    try {
        const { username, password } = req.body;

        // Check if username already exists
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).render("signup", { error: "Username already exists" });
        }

        // Create a new user
        const newUser = new User({ username, password });
        await newUser.save();

        // Store the username in the session
        req.session.username = username;

        // Redirect to main index page
        res.redirect("/index");
    } catch (error) {
        console.error(error);
        res.status(500).send("Error signing up");
    }
});

// Multer configuration for handling file uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/') // Directory where uploaded files will be stored
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname) // Unique file name
    }
});

const upload = multer({ storage: storage });

app.post("/postwork", upload.array('images', 5), async (req, res) => {
    try {
        const { title, description, deadline, price } = req.body;

        // Get the URLs of uploaded images
        const imageUrls = req.files.map(file => '/uploads/' + file.filename);

        // Get the username from the session
        const username = req.session.username;

        // Create a new task with the provided data
        const taskAdded = new Task({
            title,
            description,
            deadline,
            price,
            images: imageUrls
        });

        // Save the task to the database
        await taskAdded.save();

        // Fetch tasks again from MongoDB
        const tasks = await Task.find();

        // Render the index page with the updated tasks data
        res.render("index", {tasks});
    } catch (error) {
        console.error("Error adding task:", error); // Log any errors
        res.status(500).send("Error adding task");
    }
});

// Route for rendering the postwork page
app.get("/postwork", async (req, res) => {
    try {
        // Fetch tasks from MongoDB
        const tasks = await Task.find();

        // Check if session exists and username property is set
        if (!req.session || !req.session.username) {
            // Handle the case where session is not available or username is missing
            return res.status(401).send("Unauthorized access (no username in session)");
        }

        const username = req.session.username;

        // Render the postwork page with the tasks and username data
        res.render("postwork", { tasks, username });
    } catch (error) {
        console.error("Error fetching tasks:", error);
        res.status(500).send("Error fetching tasks");
    }
});


//Listening on the port 
const port = 6969;
server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

//hello get to the next step