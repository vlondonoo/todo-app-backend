
module.exports = (sequelize, type) => {
  console.log("valoressss", type)
  return sequelize.define('todo', {
    id: {
      type: type.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    message: type.STRING,
    state: type.STRING,
    image: type.STRING
  })
}