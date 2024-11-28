require('./utils/databaseUtil')
const express = require('express')
const userRouter = require('./routes/userRouter')
require('dotenv').config()
const cors = require('cors');


const app = express()


app.use(cors())

app.use(express.json())

app.use(userRouter)

const port = process.env.PORT
app.listen(port, () => {
  console.log(`Server is on port ${port}`)
})