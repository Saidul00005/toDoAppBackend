const mongoose = require('mongoose')
require('dotenv').config()

const username = process.env.UN
const password = process.env.PAS
const cluster = process.env.CL
const appname = process.env.AN

const mongoDB_url = `mongodb+srv://${username}:${password}@${cluster}.oeusr.mongodb.net/?retryWrites=true&w=majority&appName=${appname}`



async function main() {
  await mongoose.connect(mongoDB_url)
}

main().then(() => {
  console.log('Database connection success.')
}).catch((err) => {
  console.error('Database connection error.', err)
})