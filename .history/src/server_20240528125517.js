const express = require("express");
const app = express();
const path = require("path");
const hbs = require("hbs");
const collection = require("./mongodb");

const templatePath = path.join(__dirname, '../templates');

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// View engine setup
app.set("view engine", "hbs");
app.set("views", templatePath);

// Routes
app.get("/", (req, res) => {
    res.render("index");
});

app.get("/login", (req, res) => {
    res.render("login");
});

app.post("/signup", async (req, res) => {
    try {
        const data = {
            name: req.body.,
            password: req.body.password
        };

        await collection.insertMany(data);
        
        res.render("index");
    } catch (error) {
        res.status(500).send("Error signing up");
    }
});


app.post("/login", async (req, res)=>{
    try{
        const check = await collection.findOne({name: req.body.floatingInput})

        if(check.password === req.body.floatingPassword){
            res.render("index")
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
