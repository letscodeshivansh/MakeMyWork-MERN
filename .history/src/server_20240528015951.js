const express = require('express')
const app = express()


const port = 300;
// respond with "hello world" when a GET request is made to the homepage
app.get('/', (req, res) => {
  res.send('hello world')
})