const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const path = require("path");
const multer = require("multer");
const session = require('express-session');
const { Task, User } = require("./mongodb");

require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const parentDir = path.join(__dirname, '../');

// Using session with longer expiry time
app.use(session({
    secret: 'secretkey',
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 365 * 24 * 60 * 60 * 1000, // 1 year in milliseconds
        // You can also add other cookie properties here if needed
        // For example, setting secure: true if using HTTPS
    }
}));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.set("views", path.join(parentDir, "templates"));
app.set('view engine', 'ejs');

app.use(express.static(path.join(parentDir, "public")));
app.use(express.static(path.join(parentDir, "assets")));

app.get("/", (req, res) =>{
    res.render("landing")
});

app.get("/index", async (req, res) => {
    try {
        const tasks = await Task.find();
        const username = req.session.username;
        res.render("index", { tasks, username });
    } catch (error) {
        console.error("Error fetching tasks:", error);
        res.status(500).send("Error fetching tasks");
    }
});

app.get("/chat", (req, res) => {
    // Assuming you have the task owner's username stored in a variable called taskOwner
    const taskOwner = req.session.username || "Anonymous"; // Get the username from the session or set it as "Anonymous"
    res.render("chat", { taskOwner }); 
});


app.get("/chat.js", (req, res) => {
    res.sendFile(path.join(__dirname, "chat.js"));
});

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
        socket.broadcast.emit('chat-message', data)
    })

    socket.on('feedback', (data) => {
        socket.broadcast.emit('feedback', data)
    })
}

app.get("/login", (req, res) => {
    res.render("login");
});

app.post("/login", async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username, password });

        if (!user) {
            return res.status(401).render("login", { error: "Invalid username or password" });
        }

        req.session.username = username;
        res.redirect("/index");
    } catch (error) {
        console.error(error);
        res.status(500).send("Error logging in");
    }
});

app.get("/signup", (req, res) => {
    res.render("signup");
});

app.post("/signup", async (req, res) => {
    try {
        const { username, password } = req.body;
        const existingUser = await User.findOne({ username });

        if (existingUser) {
            return res.status(400).render("signup", { error: "Username already exists" });
        }

        const newUser = new User({ username, password });
        await newUser.save();

        req.session.username = username;
        res.redirect("/index");
    } catch (error) {
        console.error(error);
        res.status(500).send("Error signing up");
    }
});

const upload = multer({ 
    storage: multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, 'uploads/')
        },
        filename: function (req, file, cb) {
            cb(null, Date.now() + '-' + file.originalname)
        }
    })
});

app.post("/postwork", upload.array('images', 5), async (req, res) => {
    try {
        const { title, description, deadline, price } = req.body;
        const imageUrls = req.files.map(file => '/uploads/' + file.filename);
        const username = req.session.username;
        const taskOwner = req.session.username; // Get the task owner's username
        const taskAdded = new Task({
            title,
            description,
            deadline,
            price,
            images: imageUrls,
            taskowner: taskOwner // Ensure taskOwner is stored with the task
        });


        await taskAdded.save();
        const tasks = await Task.find();
        res.render("index", { tasks, username }); // Pass username when rendering index
    } catch (error) {
        console.error("Error adding task:", error);
        res.status(500).send("Error adding task");
    }
});

app.get("/postwork", async (req, res) => {
    try {
        const tasks = await Task.find();
        const username = req.session.username;
        res.render("postwork", { tasks, username });
    } catch (error) {
        console.error("Error fetching tasks:", error);
        res.status(500).send("Error fetching tasks");
    }
});

const port = 6969;
server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

//add
