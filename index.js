
require("dotenv").config()
require("./db")
const express = require("express")
const mongoSanitize = require("express-mongo-sanitize")
const xss = require("xss-clean")
const cors = require("cors")
const helmet = require("helmet")
const path = require("path");
const fs = require("fs")

const user = require("./routes")

const app = express();

const port = process.env.PORT

app.use((req, res, next) => {
    const folderPath = path.join(__dirname, 'src/uploads'); // Specify the folder path

    console.log(__dirname)

    // Check if the folder exists
    if (!fs.existsSync(folderPath)) {
        // If not, create the folder
        fs.mkdirSync(folderPath);
        console.log('Folder created:', folderPath);
    } else {
        console.log("Folder exists")
    }

    next();
});


app.use(express.static(path.join(__dirname, "src/uploads")));

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

app.use(mongoSanitize())
app.use(cors())
app.use(express.json())
app.use(helmet())
app.use(xss())

app.use("/", user)


app.listen(port, () => {
    console.log(`App is running at port ${port}`)
})