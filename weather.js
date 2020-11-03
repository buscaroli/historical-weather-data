const axios = require('axios')
const dotenv = require('dotenv')

// API Keys
dotenv.config()

// Constants
const MAPBOX_KEY = process.env.MAPBOX_KEY
const WEATHER_KEY = process.env.WEATHERSTACK_KEY
const geoURL = 'http://api.mapbox.com/geocoding/v5/mapbox.places/'

// Search string from the console
const location = encodeURIComponent(process.argv.slice(2).join(' '))

// API calculated addresses
const mapboxURL = `${geoURL}${location}.json?access_token=${MAPBOX_KEY}`
const weatherBaseURL = `http://api.weatherstack.com/current?access_key=${WEATHER_KEY}`


const getCoordinates = async () => {
    try {
        const response = await axios.get(mapboxURL) 
        //console.log(response)
        return response
    } catch (err) {
        console.log('MB Error: ', err)
    }
}

getCoordinates()
    .then(response => {
        const getWeather = async () => {
            try {
                const lat = response.data.features[0].geometry.coordinates[1]
                const lon = response.data.features[0].geometry.coordinates[0]
                const weatherData = await axios.get(`${weatherBaseURL}&query=${lat},${lon}`)
                console.log(weatherData)
            } catch (err) {
                console.log('WS Error: ', err)
            }
        }
        getWeather()
})
