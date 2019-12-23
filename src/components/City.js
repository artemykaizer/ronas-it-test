import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class City extends Component {
  constructor(props) {
    super(props);
    this.deleteCity = this.deleteCity.bind(this);
  }
  
  static propTypes = {
    city: PropTypes.string.isRequired,
    weather: PropTypes.number.isRequired,
    deleteCity: PropTypes.func.isRequired
  }

  deleteCity() {
    if(localStorage.getItem('currentCity') &&
      localStorage.getItem('currentCity').toLowerCase() === this.props.city.toLowerCase()) {
      localStorage.removeItem('currentCity')
    }
    this.props.deleteCity(this.props.city.toLowerCase());
  }

  render() {
    return (
      <div className="card city-card col mb-2 mr-2">
       <div className="card-body">
        <h4 className="card-title">{this.props.city}</h4>
        <p className="card-text">Temperature: {this.props.weather}°C</p>
        <button className="btn btn-outline-danger" onClick={this.deleteCity}>Delete</button>
        </div>
      </div>
    )
  }
}
