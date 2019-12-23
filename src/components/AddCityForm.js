import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class AddCityForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
        city: "",
        inputError: false,
        empty: false
    };
    this.handleChange = this.handleChange.bind(this);
    this.sendCity = this.sendCity.bind(this);      
  }

  static propTypes = {
    sendCity: PropTypes.func.isRequired,
    error: PropTypes.string
  }

  handleChange(e) {
      const regExp = /[а-яА-ЯёЁ0-9]/;
      if(e.currentTarget.value !== "" && regExp.test(e.currentTarget.value)) {
        this.setState({inputError: true});
      } else {
          if(this.state.inputError) {
              this.setState({inputError: false});
          }
          this.setState({city: e.currentTarget.value});
      }
  }  

  sendCity(e) {
    e.preventDefault();
    this.setState({city: ""});
    if(!this.state.city.trim()) {
      this.setState({empty: true});
      setTimeout(() => this.setState({empty: false}), 2000);
    } else {
      if(JSON.parse(localStorage.getItem('citiesList'))
         .indexOf(this.state.city.toLowerCase()) !== -1
      ) {
        return
      }
      this.props.sendCity(this.state.city.toLowerCase());
    }
  }

  render() {
    return (
      <div className="container mt-2">
        {Object.keys(this.props.error).length > 0 ? 
          <p className="alert alert-danger">City is not exist</p>
          :
          null
        }
        {this.state.empty ? <p className="alert alert-danger">Field is empty</p>
        :
        null}
        <form
         onSubmit={this.sendCity}>
        <div className="form-group">
        {this.state.inputError ? <p className="alert alert-danger">Latin letters only</p> :
        null
        }
        <label htmlFor="city">Add a new city</label>
        <input
          className="form-control" 
          id="city"
          value={this.state.city}
          onChange={this.handleChange}
        />
        <button className="btn mt-2 btn-outline-primary">Submit</button>
        </div>
        </form>
      </div>
    )
  }
}
