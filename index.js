
require("dotenv").config()
require("./db")
const express = require("express")
const mongoSanitize = require("express-mongo-sanitize")
const xss = require("xss-clean")
const cors = require("cors")
const helmet = require("helmet")
const path = require("path");
const fs = require("fs")
const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express")

const user = require("./routes")

const app = express();

const port = process.env.PORT

const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Tution Master',
            version: '1.0.0',
            description: 'swagger for testing tution master',
        },
        servers: [
            {
                url: 'http://localhost:5000',
            },
        ],
    },
    apis: ['./swagger/index.js'],
};

const swaggerSpecs = swaggerJsDoc(swaggerOptions);

app.use("/api/api_docs", swaggerUi.serve, swaggerUi.setup(swaggerSpecs));



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