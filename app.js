require('./utils/databaseUtil')
const express = require('express')
require('dotenv').config()


const app = express()
const port = process.env.PORT

app.get('/', (req, res) => {
  res.send("Hello world")
})

app.listen(port, () => {
  console.log(`Server is on port ${port}`)
})