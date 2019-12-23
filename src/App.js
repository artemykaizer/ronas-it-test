import React, { Component } from 'react';
import { CHECK_POSITION, MAIN_API, API_KEY } from './constants';
import axios from 'axios';
import City from './components/City';
import AddCityForm from './components/AddCityForm';
import Loader from './components/Loader';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      citiesInfo: [],
      isFetching: false,
      error: "",
      showForm: false
    };
    this.getWeather = this.getWeather.bind(this);
    this.sendCity = this.sendCity.bind(this);
    this.deleteCity = this.deleteCity.bind(this);
  }

  sendCity(city) {
    this.setState({
      error: "",
      isFetching: true
    });
    this.getWeather(city);
  }

  componentDidMount() {
    if(localStorage.getItem('citiesList')) {
      const citiesList = JSON.parse(localStorage.getItem('citiesList'));
      citiesList.map(city => {
        return this.getWeather(city)
      });
    } else {
      localStorage.setItem('citiesList', "[]");
    }

    if(!localStorage.getItem('currentCity')) {
      this.setState({isFetching: true}, 
        () => {
        axios.get(CHECK_POSITION)
        .then(res => this.setState(() => {
          localStorage.setItem('currentCity', res.data.city.toLowerCase());
          this.getWeather(res.data.city.toLowerCase());
          return {
            isFetching: false
          }
        }))
        .catch(() => this.setState(() => {
          localStorage.setItem('currentCity', "london");
          this.getWeather("london");
          return {
            isFetching: false
          }
        }));
        }
      )
    }
  }

  deleteCity(city) {
    const citiesList = JSON.parse(localStorage.getItem('citiesList'))
    .filter(cities => cities !== city);
    this.setState(prev => ({
        citiesInfo: prev.citiesInfo.filter(cities => cities.name.toLowerCase() !== city)
    }));
    localStorage.setItem('citiesList', JSON.stringify(citiesList));
  }

  
  getWeather (city) {
    axios.get(`${MAIN_API}?q=${city}&appid=${API_KEY}&units=metric`)
    .then(res => {
      const citiesList = JSON.parse(localStorage.getItem('citiesList'));

      if(citiesList.indexOf(city) === -1) {
        citiesList.push(city);
        localStorage.setItem('citiesList', JSON.stringify(citiesList));
      }

      this.setState(prev => ({
        isFetching: false,
        citiesInfo: prev.citiesInfo.concat(res.data)
      }));
    })
    .catch(err => {
      this.setState({
        error: err.response.data.message,
        isFetching: false
      });
      setTimeout(() => this.setState({error: ""}), 2000);
    })
  }


  render() {
    if(this.state.isFetching) {
      return <Loader/>
    } else {
      return (
        <div>
        {this.state.showForm ? 
          <div>
            <AddCityForm
            sendCity={this.sendCity}
            error={this.state.error}
            />
            <button className="btn btn-primary form-button"
              onClick={() => this.setState(({showForm: false}))}
            >Hide form</button>
          </div>
          :
          <button className="btn btn-primary mt-2 form-button"
           onClick={() => this.setState(({showForm: true}))}
          >Add city</button>
        }
        <div className="container mt-3 city-list">
          {this.state.citiesInfo.map(city => {
            return <City
            weather={city.main.temp}
            city={city.name}
            deleteCity={this.deleteCity}
            key={city.id}
            />
          })}
        </div>
        </div>
      )
    }
  }
}

export default App;
