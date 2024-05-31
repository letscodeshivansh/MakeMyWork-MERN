const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const path = require("path");
const collection = require("./mongodb");

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

// Socket.io events
io.on("connection", (socket) => {
    console.log("A user connected");

    socket.on("disconnect", () => {
        console.log("User disconnected");
    });

    // Additional socket events can be added here
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
app.post("/postwork", async(req, res)=>{
    try {
        const data = {
            title: req.body.title,
            description: req.body.description,
            deadline: req.body.deadline,
            price: req.body.price
        };

        await collection.insertMany(data);
        
        res.sendFile(path.join(parentDir, "templates", "index.html"));
        
    } catch (error) {
        res.status(500).send("Error in adding the work up");
    }
});

const port = 6969;
server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
//he