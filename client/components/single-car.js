import React, {Component} from 'react'
import {connect} from 'react-redux'
import {buildfetchSingleCarThunk, buildPostCartThunk} from '../store'

import {SingleCarHeader} from './singleCarContents/single-car-header'
import {SingleCarMainView} from './singleCarContents/single-car-main-view'
import {SingleCarDetails} from './singleCarContents/single-car-details'
import Gallery from './singleCarContents/single-car-secondary-images'

/**
 * COMPONENT
 */
import './single-car.css'
export class SingleCar extends Component {
  constructor(props) {
    super(props)
    this.handleAddToCart = this.handleAddToCart.bind(this)
  }

  componentDidMount() {
    const carId = this.props.match.params.carID
    this.props.fetchSingleCar(carId)
  }

  handleAddToCart() {
    // JO: clean up vars, if time permits
    const carId = this.props.match.params.carID
    const carItem = this.props.singleCar
    const userId = this.props.user.id
    const {orders} = this.props.cartItems
    let quantity = 1
    let itemClicked = []
    let price

    if (orders.length) {
      itemClicked = orders.filter(order => order.carId === +carId)
    }
    if (itemClicked.length) {
      price = itemClicked[0].car.price
      quantity = itemClicked[0].quantity + 1
    } else {
      price = quantity * carItem.price
    }
    if (quantity > carItem.inventory) {
      alert('Inventory limit has been reached!')
    } else {
      this.props.postAddToCart(carId, carItem, userId, quantity, price)
    }
  }

  render() {
    return (
      <div id="single-car">
        <button
          className="ui primary button"
          type="button"
          onClick={this.handleAddToCart}
        >
          ADD TO CART
        </button>
        <div id="single_car_header">
          <SingleCarHeader {...this.props} />
        </div>
        <hr />
        <SingleCarMainView {...this.props} />
        <hr />
        <Gallery {...this.props} />
        <div id="single_car_details">
          <SingleCarDetails {...this.props} />
        </div>
      </div>
    )
  }
}
/**
 * CONTAINER
 */
const mapState = state => {
  return {
    singleCar: state.singleCar,
    user: state.user,
    cartItems: state.cartItems
  }
}

const mapDispatch = dispatch => ({
  fetchSingleCar: carId => {
    dispatch(buildfetchSingleCarThunk(carId))
  },
  postAddToCart: (carId, carItem, userId, quantity, price) => {
    dispatch(buildPostCartThunk(carId, carItem, userId, quantity, price))
  }
})

export default connect(mapState, mapDispatch)(SingleCar)
