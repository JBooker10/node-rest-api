const crypto = require('crypto');
const config = require('./config');


//Container for all helpers
const helpers = {}

// Create a SHA256 hash
helpers.hash = (str) => {
    if(typeof(str) == 'string' && str.length > 0) {
        const hash = crypto.createHmac('sha256', config.hashingSecret)
        .update(str)
        .digest('hex')
        return hash
    } else {
        return false;
    }
};

// Parse JSON string to an object without error
helpers.parseJsonToObject = (str) => {
    try {
        let obj = JSON.parse(str);
        return obj;
    } catch(e) {
        return {};
    }
}

// Create a string of random char of given length 
helpers.createRandomString = (strLength) => {
    strLength = typeof(strLength) == 'number' && strLength > 0 ? strLength : false;
    if(strLength) {
        // Define all the possible characters that could go into a string
        let possibleCharacters = 'abcdefghijklmnopqrstuvwxyz1234567890'
        // Start the string
        let str = '';

        for(i = 1; i <= strLength; i++) {
            // Get random character
            let randomCharacter = possibleCharacters.charAt(Math.floor(Math.random() * possibleCharacters.length))
            // Append character to final string
            str+=randomCharacter
        }

        return str;
    } else {
        return false;
    }
}

module.exports =  helpers;