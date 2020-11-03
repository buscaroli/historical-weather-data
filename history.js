const utils = require('./utils')

/* 
 *  Getting data from the console:
 * 
 *      year = Starting year 
 *      yearsToCheck = Number of years to check
 *      city = City name
 * 
 */

let year = process.argv.slice(2,3).toString()
const yearsToCheck = process.argv.slice(3,4)
const city = process.argv.slice(4).join('+') 

/* 
 *  Generating a list of address from which to extract the weather data. 
 */

let myAddresses = utils.generateLinks(year, yearsToCheck, city)

//console.log('Address: ', myAddresses[0])
// utils.getMonthData(myAddresses[0])
//     .then(data => console.log(data))

//console.log(myAddresses)
utils.getFullData(myAddresses)
    .then(data => console.log(data))