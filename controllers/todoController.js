const { TodoModel } = require('../db/sequelize');
const fs = require('fs');
const { IMAGE_FOLDER_PATH } = require('../constants');

exports.list = async function (req, res) {
  const todos = await TodoModel.findAll();
  res.send({ "list": todos });
}

exports.pendingTask = async function (req, res) {
  const pendingList = await TodoModel.findAll({ where: { 'state': 'OPEN' } });
  res.send({ "list": pendingList });
}

exports.closedTask = async function (req, res) {
  const closedList = await TodoModel.findAll({ where: { 'state': 'CLOSE' } });
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
  let imageName;

  if (req.files && req.files.file && req.files.file.name) {
    imageName = `${Date.now()}_${req.files.file.name}`;
    const newpath = `${IMAGE_FOLDER_PATH}/${imageName}`;
    fs.writeFileSync(newpath, req.files.file.data);
  } else {
    imageName = '';
  }
  await TodoModel.create({
    message: req.body.task,
    state: "OPEN",
    image: imageName,
  });
  return res.send({ "res": "valid" });

};

exports.delete = async (req, res) => {
  const id = req.params.id;
  await TodoModel.findAll({ where: { 'id': id } }).then(data => {
    if (data[0].dataValues.image && data[0].dataValues.image != '') {
      const newpath = `${IMAGE_FOLDER_PATH}/${data[0].dataValues.image}`;
      try {
        fs.unlinkSync(newpath);
      } catch (err) {
        console.error(err);
      }
    }
  });;


  await TodoModel.destroy({ where: { id: id } });
  res.send({});
};

exports.update = async (req, res) => {
  const id = req.params.id;
  const state = req.params.state;
  const updatedTodo = {
    state
  };

  await TodoModel.update(updatedTodo, { where: { id: id } });
  res.send({});
};
