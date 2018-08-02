const request = require('request');

 
const getWeather = (lat, lng, callback) => {
    request({
        url: `https://api.darksky.net/forecast/4e545d05fb1ef18a03ad95c67c78754e/${lat},${lng}`,
        json: true
    }, (error, response, body) => {
        if(!error && response.statusCode === 200) {
            callback(undefined, { 
                temperature: body.currently.temperature,
                apparentTemperature: body.currently.apparentTemperature
            });
        } else {
            callback(`Unable to fetch weather`)
        }
    })
}

module.exports.getWeather = getWeather;