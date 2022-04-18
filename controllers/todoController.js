const { TodoModel } = require('../db/sequelize');
const fs = require('fs');
const path = require('path');
const multer = require("multer");



exports.list = async function (req, res) {
  const todos = await TodoModel.findAll();
  res.send({ "list": todos })
}

exports.pendingTask = async function (req, res) {
  const pendingList = await TodoModel.findAll({ where: { 'state': 'OPEN' } })
  res.send({ "list": pendingList });
}

exports.closedTask = async function (req, res) {
  const closedList = await TodoModel.findAll({ where: { 'state': 'CLOSE' } })
  res.send({ "list": closedList });
}

exports.listOrderedPending = async function (req, res) {
  const todos = await TodoModel.findAll({
    where: { 'state': 'OPEN' }, order: [['message', req.params.direction]]
  });
  res.send({ "list": todos });
}

exports.listOrderedClosed = async function (req, res) {
  const todos = await TodoModel.findAll({
    where: { 'state': 'CLOSE' }, order: [['message', req.params.direction]]
  });
  res.send({ "list": todos });
}
exports.add = async (req, res) => {
  //let valores = req.files.file


  console.log("esto es lo que es ======", req.body.task, '-------', req.files)
  //console.log('==******=====', (req.files))


  // return res.send({ "res": "valid" });
  const folderDest = `D:/Maestria/todo-app-frontend/src/assets/`
  const imageName = `${Date.now()}_${req.files.file.name}`

  const newpath = `${folderDest}/${imageName}`;
  console.log('directorio', newpath)
  fs.writeFileSync(newpath, req.files.file.data);


  const newTodo = await TodoModel.create({
    message: req.body.task,
    state: "OPEN",
    image: imageName,
  });
  // const PATH = path.join(__dirname, '/assets');
  // let storage = multer.diskStorage({
  //   destination: (req, file, cb) => {
  //     cb(null, PATH);
  //   },
  //   filename: (req, file, cb) => {
  //     cb(null, file.originalname + "-" + Date.now());
  //   },
  // });

  // let upload = multer({
  //   storage: storage,
  // });



  //upload.single('file')
  //const fileToUpload = req.files.file;

  console.log("dataaaaa", newTodo)
  /*if (fileToUpload) {
    const oldpath = "D:/Maestria/todo-app-frontend/src/assets/image/IMG_9819.JPG"
    const dirPath = 'D:/Maestria/todo-app-backend/assets/'

    console.log('=======+++++++++++++', dirPath)
    newpath = dirPath + newTodo.id + ".jpg";
    fs.rename(oldpath, newpath, function (err) {
      if (err) throw err;
    });
    newTodo.image = newTodo.id + ".jpg";
    console.log('newTodo=====', newTodo)
    await newTodo.save({ fields: ['image'] });
  }*/
  return res.send({ "res": "valid" });

};

exports.delete = async (req, res) => {
  const id = req.params.id;
  await TodoModel.destroy({ where: { id: id } });
  const imagePath = path.join(__dirname.replace('controllers', ''), '/public/uploads/');
  newpath = imagePath + id + ".jpg";
  try {
    fs.unlinkSync(newpath) //file removed
  } catch (err) {
    //nothing
  }

  res.redirect("/todos");
};

exports.update = async (req, res) => {
  const id = req.params.id;
  const state = req.params.state;
  const updatedTodo = {
    state
  };

  await TodoModel.update(updatedTodo, { where: { id: id } });
  res.redirect("/todos");
};
