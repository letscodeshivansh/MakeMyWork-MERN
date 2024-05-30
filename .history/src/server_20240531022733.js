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
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Task Form</title>
  <!-- Link to the Tailwind CSS CDN -->
  <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
</head>

<body>
  <div class="container mx-auto mt-8">
    <form class="max-w-md mx-auto p-4 bg-white rounded shadow-md">
      <h2 class="text-lg text-gray-800 mb-4">Add Task</h2>
      <div class="mb-4">
        <label class="block text-gray-700 text-sm font-bold mb-2" for="title">Title</label>
        <input class="w-full px-3 py-2 text-gray-700 border border-gray-300 rounded" id="title" type="text"
          placeholder="Enter task title">
      </div>
      <div class="mb-4">
        <label class="block text-gray-700 text-sm font-bold mb-2" for="description">Description</label>
        <textarea class="w-full px-3 py-2 text-gray-700 border border-gray-300 rounded" id="description"
          placeholder="Enter task description"></textarea>
      </div>
      <div class="mb-4">
        <label class="block text-gray-700 text-sm font-bold mb-2" for="deadline">Deadline</label>
        <input class="w-full px-3 py-2 text-gray-700 border border-gray-300 rounded" id="deadline" type="date"
          placeholder="Enter task deadline">
      </div>
      <div class="mb-4">
        <label class="block text-gray-700 text-sm font-bold mb-2" for="price">Price</label>
        <input class="w-full px-3 py-2 text-gray-700 border border-gray-300 rounded" id="price" type="number"
          placeholder="Enter task price">
      </div>
      <button class="bg-gray-800 hover:bg-gray-900 text-white font-bold py-2 px-4 rounded" type="submit">Add
        Task</button>
    </form>
  </div>
</body>

</html>

//for posting work



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

app.listen(6969, () => {
    console.log("Server is running on port 6969");
});
