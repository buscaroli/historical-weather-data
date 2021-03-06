const axios = require('axios')
const cheerio = require('cheerio')
const fs = require('fs')

// Will use to cycle through the months in a loop
const months = [
    'Gennaio',
    'Febbraio',
    'Marzo',
    'Aprile',
    'Maggio',
    'Giugno',
    'Luglio',
    'Agosto',
    'Settembre',
    'Ottobre',
    'Novembre',
    'Dicembre'
]

const generateLinks = (year=1980, yearsToCheck=1, city) => {
    // Base address of the weather forecast service with the historical data.
    const baseURL = 'https://www.ilmeteo.it/portale/archivio-meteo/'

    // Get current year and month
    let today = new Date()
    let cYear = today.getFullYear()

    // Starting from Gennaio/January
    let month = months[0]
    // Initial address
    let fullURL = `${baseURL}${city}/${year}/${month}`
    // Will store the links to fetch from the web.
    let links = []

    if (!city) {
        return console.log('The name of the city is required.\nExample: node history.js [year] [years number] [city name]')
    }
    for (let i = 0; i < yearsToCheck; i++) {
        months.forEach((month) => {
            //console.log(`Year: ${year}, cYear: ${cYear}, typeof(year): ${typeof(year)}, typeof cYear: ${typeof(cYear)}`)
            if (year < cYear){
                links.push(fullURL = `${baseURL}${city}/${year}/${month}`)
            } 
        })
        year++
    }
    return links
} 

// Utility function that fetches a webpage and deals with errors
const fetchPage = async (link) => {
    try {
        const html = await axios.get(link)
        return html
    }catch(err) {
        if (err.response) {
            console.log('Response err ', err.response)
        } else if(err.request) {
            console.log('Request err: ', err.request)
        } else {
            console.log('Unidentified err: ', err)
        }
    }
}

// Returns an array of arrays each containing the data for every
// day of the given month
const getMonthData = async (link) => {
    let data = await fetchPage(link) 
    const $ = cheerio.load(data.data)

    let myarray = []
    $('#mainc > .block tr').each((i, element) => {
        let dayArray = []
        if (i >= 14) {
            $(element).contents().each((j, dayData) => {
                if (j <= 7) {
                    dayArray.push(
                        Number($(dayData).text().replace(/[^\d.-]/g, ''))
                    )
                }
            })
            myarray.push(
                dayArray
            )
        }
    })
    myarray.pop()
    myarray.pop()
    return myarray
}

// Gets and extracts the data for the given time span
const getFullData = async (links) => {
    let currentMonth = null
    let promises = []
    links.forEach(async link => {
        currentMonth = getMonthData(link)
        promises.push(currentMonth)
    })
    let data = await axios.all(promises)
    //console.log(data)
    return data
}

// Utility Function that prints the a month worth of data
const printMonthData = (data) => {
    console.log('Day      Tavg C   Tmin C   Tmax C   Rain mm  Umid%    Wind Km/hGust Km/h')
    data.forEach(month => {
        let line = ''
        month.forEach(item => {
            let paddedItem = (item + '          ').slice(0, 9)
            line+=paddedItem
        })
        console.log(line)
    })
}

// utility function that prints a month in succession every time it's invoked
const printMonth = (function() {
    let i = 0
    return function () {
      if (i == 12) {
        i = 0
      } 
        console.log('\n *** ' + months[i] + ' ***\n')
        return i++
    }
    
}())

// Prints the full data to the console
const printFull = (year, data) => {
    let i = 0
    console.log('------------------------------------------------------------------------')
    data.forEach(month => {
        if (i % 12 === 0){
            console.log(`\n${year++}\n`)
        }
        printMonth()
        printMonthData(month)
        i++
    })
}

// Utility function that cycles through the months
const cycleMonth = (function() {
    let i = 0
    return function () {
        if (i == 12) {
            i = 0
        } 
        return i++
    }
    
}())

// Stores all data into an array of JS objects and returns it.
const dumpData = (city, year, data) => {
    let currentYear = year
    let currentMonth = months[0]

    let collectedData = []

    let traversedMonths = 0
    data.forEach(month => {
        
        currentMonth = cycleMonth()

        month.forEach(day => {
            collectedData.push(
                {
                    city:           city,
                    year:           parseInt(currentYear),
                    month:          currentMonth,
                    day:            day[0],
                    tempAvg:        day[1],
                    tempMin:        day[2],
                    tempMax:        day[3],
                    rainMm:         day[4],
                    umidityPercent: day[5],
                    windSpeed:      day[6],
                    gustSpeed:      day[7]
                }
            )}
        )  
        traversedMonths++
        
        if (traversedMonths % 12 === 0) {
            currentYear++
        }
    })
    return collectedData
}
    

module.exports = {
    generateLinks,
    getMonthData,
    getFullData,
    printMonthData,
    printFull,
    dumpData
}