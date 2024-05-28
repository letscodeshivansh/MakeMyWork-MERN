const express = require("express");
const app = express();
const path = require("path");
const collection = require("./mongodb");

const templatePath = path.join(__dirname, '../templates');

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Set the views directory
app.set("views", templatePath);

// Serve static files (CSS, JS, images, etc.)
app.use(express.static(path.join(__dirname, "../public")));

// Routes
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../templates/index.html"));
});

app.get("/login", (req, res) => {
    res.sendFile(path.join(__dirname, "../templates/login.html"));
});

app.post("/signup", async (req, res) => {
    try {
        const data = {
            name: req.body.floatingInput,
            password: req.body.floatingPassword
        };

        await collection.insertMany(data);
        
        res.sendFile(path.join(__dirname, "../templates/index.html"));
    } catch (error) {
        res.status(500).send("Error signing up");
    }
});


app.post("/login", async (req, res)=>{
    try{
        const check = await collection.findOne({name: req.body.floatingInput})

        if(check.password === req.body.floatingPassword){
            res.sendFile(path.join(__dirname, "../templates/index.html"));
        }
        else{
            res.send("Wrong Password")
        }
    }
    catch{
        res.send("Wrong Details")
    }
})

app.listen(3002, () => {
    console.log("Server is running on port 3002");
});
