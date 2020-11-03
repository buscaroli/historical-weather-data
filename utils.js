const axios = require('axios')
const cheerio = require('cheerio')
const fs = require('fs')

const generateLinks = (year=1980, yearsToCheck=2, city) => {
    // Base address of the weather forecast service with the historical data.
    const baseURL = 'https://www.ilmeteo.it/portale/archivio-meteo/'

    // Will cycle through the months in a loop
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
            links.push(fullURL = `${baseURL}${city}/${year}/${month}`) 
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

const getFullData = async (links) => {
    let currentMonth = null
    let promises = []
    links.forEach(async link => {
        currentMonth = getMonthData(link)
        promises.push(currentMonth)
    })
    let data = await axios.all(promises)
    console.log(data)
}

module.exports = {
    generateLinks,
    getMonthData,
    getFullData
}