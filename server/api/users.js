const router = require('express').Router()
const {User, Order, CartItem, Car} = require('../db/models')
module.exports = router

router.get('/', async (req, res, next) => {
  try {
    const users = await User.findAll({
      attributes: ['id', 'email']
    })
    res.json(users)
  } catch (err) {
    next(err)
  }
})

router.get('/:userId/mycart', async (req, res, next) => {
  try {
    const userData = await Order.findOne({
      where: {
        userId: req.params.userId,
        isCheckedOut: false
      }
    })
    const orderId = userData.id

    const items = await CartItem.findAll({
      where: {
        orderId: orderId
      },
      include: [
        {
          model: Order
        },
        {
          model: Car
        }
      ]
    })
    console.log(items)
    res.json(items)
  } catch (err) {
    next(err)
  }
})

router.post('/:userId/mycart', async (req, res, next) => {
  try {
    const order = await Order.findOne({
      where: {
        userId: req.params.userId,
        isCheckedOut: false
      }
    })

    await CartItem.create({
      carId: req.body.carId,
      orderId: order.id,
      quantity: req.body.quantity
    })

    const cartItem = await CartItem.findOne({
      where: {
        carId: req.body.carId,
        orderId: order.id
      },
      include: [
        {
          model: Car
        },
        {
          model: Order
        }
      ]
    })
    res.json(cartItem)
  } catch (err) {
    next(err)
  }
})

router.delete('/:cartItemId/mycart', async (req, res, next) => {
  try {
    const cartItemId = req.params.cartItemId

    if (cartItemId !== 'undefined') {
      const response = await CartItem.destroy({
        where: {
          id: cartItemId
        }
      })
      res.json(response)
    }
  } catch (error) {
    next(error)
  }
})

router.put('/:userId/mycart', async (req, res, next) => {
  try {
    const order = await Order.findOne({
      where: {
        userId: req.params.userId,
        isCheckedOut: false
      }
    })

    const existingCartItem = await CartItem.findOne({
      where: {carId: req.body.carId, orderId: order.id},
      include: [
        {
          model: Car
        },
        {
          model: Order
        }
      ]
    })

    if (req.body.handle === true) {
      const response = await existingCartItem.update({
        quantity: existingCartItem.quantity + 1
      })
      res.json(response)
    } else {
      const response = await existingCartItem.update({
        quantity: existingCartItem.quantity - 1
      })
      res.json(response)
    }
  } catch (err) {
    next(err)
  }
})

router.put(`/:userId/checkout`, async (req, res, next) => {
  try {
    const order = await Order.findOne({
      where: {
        userId: req.params.userId,
        isCheckedOut: false
      }
    })

    await order.update({
      isCheckedOut: true,
      purchaseDate: new Date().toISOString()
    })
    const newOrder = await Order.create({
      purchaseDate: null,
      isCheckedOut: false,
      userId: req.params.userId
    })
    res.json(newOrder)
  } catch (err) {
    next(err)
  }
})
