const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require('dotenv');
const todoController = require("./controllers/todoController");
const fileUpload = require('express-fileupload');

var cors = require('cors');

dotenv.config();

const app = express();
app.use(fileUpload());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(cors({
    origin: '*',
    'Access-Control-Allow-Headers': '*',
    'Access-Control-Allow-Origin': '*'
}));

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