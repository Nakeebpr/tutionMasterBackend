
require("dotenv").config()
require("./db")
const express = require("express")
const mongoSanitize = require("express-mongo-sanitize")
const xss = require("xss-clean")
const cors = require("cors")
const helmet = require("helmet")

const user = require("./routes")

const app = express();

const port = process.env.PORT

app.use(mongoSanitize())
app.use(cors())
app.use(express.json())
app.use(helmet())
app.use(xss())

app.use("/", user)


app.listen(port, () => {
    console.log(`App is running at port ${port}`)
})