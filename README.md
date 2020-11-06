# historical-weather-data
Scraping the web for historical weather data.
It's a bunch of scripts that I used to practise using axios and cheerio, might be helpful to implement a web app that prints the data.
There is a forecast.js file that can't be used/tested as the service required a (paid) subscription.
In order to use weather.js you need a valid API key for weatherStack and MapBox that can be added to the local environment respectively as WEATHER_KEY and MAPBOX_KEY.  

## Two console apps included in this repo:
1. weather.js: collects data from weatherStack and putputs to the console the data
2. history.js: scrapes the historical weather data from an italian weather forecast service and prints the data to the console.

## How to use
1. node weather <town name>
   Can be any town in the world.
   Example:
   node weather los angeles
  
  
  
2. node history <starting year> <number of years> <town name>
   Only works for Italian towns as the weather forecast service from which the data is collected only cover Italy.
   Example:
   node history 1994 3 rimini
  
