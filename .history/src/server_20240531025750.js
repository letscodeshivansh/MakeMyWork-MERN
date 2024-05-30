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

//for login
app.get("/login.html", (req, res) => {
    res.sendFile(path.join(parentDir, "templates", "login.html"));
});

//for sign up 
app.get("/signup.html", (req, res) => {
    res.sendFile(path.join(parentDir, "templates", "signup.html"));
});

//for posting work
app.get("/postwork.html", (req, res) => {
    res.sendFile(path.join(parentDir, "templates", "postwork.html"));
});




app.post("/signup.html", async (req, res) => {
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

app.listen(6969, () => {
    console.log("Server is running on port 6969");
});
