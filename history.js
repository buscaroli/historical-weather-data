/* 
 *  Getting weather data from the console, call as:
 *      > node history.js year yearsToCheck city
 * 
 *  eg: 
 *      > node history.js 2012 3 rimini       
 * 
 *      year = Starting year 
 *      yearsToCheck = Number of years to check
 *      city = City name
 * 
 */

const utils = require('./utils')


let year = process.argv.slice(2,3).toString()
const yearsToCheck = process.argv.slice(3,4)
const city = process.argv.slice(4).join('+') 


// Generating a list of address from which to extract the weather data. 
let myAddresses = utils.generateLinks(year, yearsToCheck, city)
// console.log(myAddresses)

// Displaying the data to the console.
// utils.getFullData(myAddresses)
//     .then(data => utils.printFull(year, data))

// Prints the data to the console
// utils.getFullData(myAddresses)
//     .then(data => console.log(data))

// Prints the data to the console as an array of JSON objects
utils.getFullData(myAddresses)
    .then(data => utils.dumpData(city, year, data))
    .then(weatherData => weatherData.forEach(day => console.log(day)))
    .catch(err => console.log(err))