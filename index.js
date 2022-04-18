const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require('dotenv');
const todoController = require("./controllers/todoController");
const fileUpload = require('express-fileupload');

var cors = require('cors')

dotenv.config();

const app = express();
//app.use(bodyParser.json({ limit: "50mb", extended: true }));
//app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
app.use(fileUpload());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());




const path = require('path');
const multer = require("multer");

const PATH = path.join(__dirname, '/assets');
let storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, PATH);
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname + "-" + Date.now());
    },
});

let upload = multer({
    storage: storage,
});







app.use(cors({
    origin: '*',
    'Access-Control-Allow-Headers': '*',
    'Access-Control-Allow-Origin': '*'
}))


app.get('/', (req, res) => {
    res.send({ "response": "12345" })
});

//app.get('/', homeController.home);
//app.get('/about', homeController.about);
app.get('/todos', todoController.list);
app.get('/todos/pending', todoController.pendingTask);
app.get('/todos/closed', todoController.closedTask);
app.get('/listOrderedPending/:direction', todoController.listOrderedPending);
app.get('/todosOrderedClosed/:direction', todoController.listOrderedClosed);
app.post('/todos', todoController.add);
app.get('/todos/delete/:id', todoController.delete);
app.get('/todos/update/:id/:state', todoController.update);

app.use(express.static("public"));

PORT = process.env.NODE_PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});