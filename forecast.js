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
const days = '3'
const units = 'm'


// API calculated addresses
const mapboxURL = `${geoURL}${location}.json?access_token=${MAPBOX_KEY}`
const weatherBaseURL = `http://api.weatherstack.com/forecast?access_key=${WEATHER_KEY}&forecast_days=${days}&units${units}`

axios.get(mapboxURL)
    .then(response => {
        
        const lat = response.data.features[0].geometry.coordinates[1]
        const lon = response.data.features[0].geometry.coordinates[0]
        console.log(`${weatherBaseURL}&query=${lat},${lon}`)
        return axios.get(`${weatherBaseURL}&query=${lat},${lon}`)
        
        
    })
    .then(response => {
        console.log(response)
    })
    .catch(error => {
        console.log('Error encountered, be more specific or try a different search.\nInternal Error: ', error.message)
    }) 
