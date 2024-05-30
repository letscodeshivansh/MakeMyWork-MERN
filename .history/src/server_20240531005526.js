const express = require("express");
const app = express();
const path = require("path");
const collection = require("./mongodb");

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

app.get("/login.html", (req, res) => {
    res.sendFile(path.join(parentDir, "templates", "login.html"));
});

app.post("/signup.", async (req, res) => {
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

app.post("/login", async (req, res) => {
    try {
        const check = await collection.findOne({ name: req.body.floatingInput });

        if (check.password === req.body.floatingPassword) {
            res.sendFile(path.join(parentDir, "templates", "index.html"));
        } else {
            res.send("Wrong Password");
        }
    } catch (error) {
        res.status(500).send("Error logging in");
    }
});

app.listen(6969, () => {
    console.log("Server is running on port 6969");
});
