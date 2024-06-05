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

// Routes
app.get("/index", async (req, res) => {
    try {
      const tasks = await Task.find(); // Fetch tasks data
      const username = req.query.username; // Access username from query string (optional)
  
      res.render("index.ejs", { tasks, username }); // Pass data to the template
    } catch (error) {
      console.error("Error fetching tasks:", error.message);
      res.status(500).send("Error fetching tasks");
    }
});

app.get("/:username", async (req, res) => {
    const { username } = req.params;
  
    // Assuming you want to check if the username exists in the database
    const user = await User.findOne({ username });
  
    if (!user) {
      return res.status(404).send("User not found");
    }
  
    // Use the username for rendering or processing (optional)
    res.render("index", { username }); // Example rendering of user page
});

// For sign up 
app.get("/signup.html", (req, res) => {
    res.sendFile(path.join(parentDir, "templates", "signup.html"));
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

//handling signup request
app.post("/signup", async (req, res) => {
    try {
      const { username, password } = req.body;
  
      // Check if username already exists
      const existingUser = await User.findOne({ username });
      if (existingUser) {
        return res.status(400).render("signup", {error: "Username already exists"});
      }
  
      // Create a new user
      const newUser = new User({ username, password });
      await newUser.save();
  
      // Handle successful signup (e.g., redirect to login)
      res.redirect("/"); // Replace with your desired action
    } catch (error) {
      console.error(error);
      res.status(500).send("Error creating user");
    }
});
  
// Serve the login page
app.get("/login", (req, res) => {
    const error = req.query.error;
    res.render("login", { error })
      .catch(err => {
        console.error('Error rendering login page:', err);
        res.status(500).send('Error rendering login page');
      });
});
  
//checking email and password for login 
app.post("/login", async (req, res) => {
    try {
      const { username, password } = req.body; // Assuming username in request body
  
      // Find the user by username
      const user = await User.findOne({ username });

      if (!username || !password) {
        return res.status(400).render("login", { error: "Please enter username and password" });
      }
  
      if (!user) {
        return res.status(401).render("login", { error: "User Not found" });
      }
  
      if (user.password === password) {
        // Login successful, store username in session
        req.session.username = username;
  
        // Redirect to main index page
        res.redirect("/index"); 
      } else {
        res.status(401).render("login", { error: "Wrong Password" });
      }
    } catch (error) {
      console.error(error);
      res.status(500).send("Error logging in");
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

app.get("/postwork", (req, res) => {
  // Check if session exists and username property is set
  if (!req.session || !req.session.username) {
    // Handle the case where session is not available or username is missing
    return res.status(401).send("Unauthorized access (no username in session)");
  }

  const username = req.session.username;

  // Use the username for rendering or further processing
  res.render("postwork", { username }); // Pass username to the template (optional)
});

  

// Add a route to render job cards on the index page
app.get('/jobcards', async (req, res) => {
    try {
        // Retrieve tasks from MongoDB
        const tasks = await Task.find();
        res.render('index', {tasks}); // Pass tasks data to the index.ejs template
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