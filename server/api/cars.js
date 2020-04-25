const router = require('express').Router()
const {Car} = require('../db/models')
module.exports = router

router.get('/', async (req, res, next) => {
  try {
    const users = await Car.findAll()
    res.json(users)
  } catch (err) {
    next(err)
  }
})

router.get('/:carId', async (req, res, next) => {
  try {
    const id = req.params.carId

    const singleCar = await Car.findOne({
      where: {id: id}
    })

    res.json(singleCar.dataValues)
  } catch (err) {
    next(err)
  }
})

router.post('/', async (req, res, next) => {
  try {
    const {
      brand,
      name,
      image,
      price,
      year,
      color,
      interiorColor,
      engineType,
      stockNo,
      transmission,
      doors,
      vin,
      vehicleId,
      isSold,
      inventory
    } = req.body
    const newCar = await Car.create({
      brand,
      name,
      image,
      price,
      year,
      color,
      interiorColor,
      engineType,
      stockNo,
      transmission,
      doors,
      vin,
      vehicleId,
      isSold,
      inventory
    })
    res.json(newCar)
  } catch (error) {
    next(error)
  }
})

router.delete('/:carId', async (req, res, next) => {
  try {
    const removeCar = await Car.destroy({
      where: {id: req.params.carId}
    })
    res.json(removeCar)
  } catch (error) {
    next(error)
  }
})

router.put('/:carId', async (req, res, next) => {
  try {
    const {
      brand,
      name,
      image,
      price,
      year,
      color,
      interiorColor,
      engineType,
      stockNo,
      transmission,
      doors,
      vin,
      vehicleId,
      isSold,
      inventory
    } = req.body
    const car = await Car.findByPk(req.params.carId)
    const editCar = await car.update({
      brand,
      name,
      image,
      price,
      year,
      color,
      interiorColor,
      engineType,
      stockNo,
      transmission,
      doors,
      vin,
      vehicleId,
      isSold,
      inventory
    })
    res.status(201).json(editCar)
  } catch (error) {
    next(error)
  }
})
