import React, {Component} from 'react'
import {
  BrowserRouter as Router,
  Link,
  Route,
  Switch,
  withRouter
} from 'react-router-dom'
import AllCars from '../client/components/AllCars'
import {connect} from 'react-redux'
import PropTypes from 'prop-types'
import {
  Login,
  Signup,
  UserHome,
  SingleCar,
  MyCart,
  Faker,
  GuestCart,
  Admin,
  AdminAddCar,
  AdminEditCar
} from './components'
import {me} from './store'

class Routes extends Component {
  componentDidMount() {
    this.props.loadInitialData()
  }

  render() {
    const {isLoggedIn} = this.props
    const {isAdmin} = this.props

    return (
      <Switch>
        {/* Routes placed here are available to all visitors */}
        <Route exact path="/" component={UserHome} />
        <Route exact path="/login" component={Login} />
        <Route exact path="/signup" component={Signup} />
        <Route exact path="/guestcart" component={GuestCart} />

        <Route exact path="/cars" component={AllCars} />
        <Route exact path="/cars/:carID" component={SingleCar} />
        {isLoggedIn && <Route path="/home" component={UserHome} />}
        {isLoggedIn && (
          <Route exact path="/users/:userID/mycart" component={MyCart} />
        )}
        {isAdmin && (
          <Switch>
            <Route path="/admin/add" component={AdminAddCar} />
            <Route path="/admin/edit/:carId" component={AdminEditCar} />
            <Route path="/admin" component={Admin} />
          </Switch>
        )}

        {/* Displays our Login component as a fallback */}
        <Route component={Login} />
      </Switch>
    )
  }
}

/**
 * CONTAINER
 */
const mapState = state => {
  return {
    // Being 'logged in' for our purposes will be defined has having a state.user that has a truthy id.
    // Otherwise, state.user will be an empty object, and state.user.id will be falsey
    isAdmin: state.user.isAdmin,
    isLoggedIn: !!state.user.id,
    user: state.user,
    cartItems: state.cartItems
  }
}

const mapDispatch = dispatch => {
  return {
    loadInitialData() {
      dispatch(me())
    }
  }
}

// The `withRouter` wrapper makes sure that updates are not blocked
// when the url changes
export default withRouter(connect(mapState, mapDispatch)(Routes))

/**
 * PROP TYPES
 */
Routes.propTypes = {
  loadInitialData: PropTypes.func.isRequired,
  isLoggedIn: PropTypes.bool.isRequired
}
