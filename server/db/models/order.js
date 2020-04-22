const Sequelize = require('sequelize')
const db = require('../db')

const Order = db.define('order', {
  purchaseDate: {
    type: Sequelize.DATE
  },
  isCheckedOut: {
    type: Sequelize.BOOLEAN,
    defaultValue: false
  }
})

module.exports = Order
