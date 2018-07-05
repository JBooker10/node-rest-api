
// Request Handlers
const _data = require('./data');
const helpers = require('./helpers');

const handlers = {};

handlers.ping = (data, callback) => {
    callback(200)
};


handlers.notFound = (data, callback) => {
    callback(404)
};



handlers.users = (data,callback) => {
    let acceptableMethods = ['post', 'get', 'put', 'delete'];
    if(acceptableMethods.indexOf(data.HTTPmethod) > -1) {
        handlers._users[data.HTTPmethod](data,callback);
    } else {
        callback(405)
        console.log(data.HTTPmethod)
    }
}

handlers._users = {};


//@POST request
// firstName, lastName, phone, password, tosAgreement
handlers._users.post = (data, callback) => {
    
    // Check that all required fields are filled out
  let firstName = typeof(data.payload.firstName) == 'string' && data.payload.firstName.trim().length > 0 ? data.payload.firstName.trim() : false;
  let lastName = typeof(data.payload.lastName) == 'string' && data.payload.lastName.trim().length > 0 ? data.payload.lastName.trim() : false;
  let phone = typeof(data.payload.phone) == 'string' && data.payload.phone.trim().length == 10 ? data.payload.phone.trim() : false;
  let password = typeof(data.payload.password) == 'string' && data.payload.password.trim().length > 0 ? data.payload.password.trim() : false;
  let tosAgreement = typeof(data.payload.tosAgreement) == 'boolean' && data.payload.tosAgreement == true ? true : false;

    if(firstName && lastName && phone && password && tosAgreement) {
        // Make sure that the user doesn't already exist
        _data.read('users', phone, (err, data) => {
            if(err) {
                // Hash the password
                const hashedPassword = helpers.hash(password);

                if(hashedPassword) {
                        // Create the user obj
                const userObject = {
                    'firstName' : firstName,
                    'lastName' : lastName,
                    'phone' : phone,
                    'hashedPassword' : hashedPassword,
                    'tosAgreement' : tosAgreement
                };

                _data.create('users', phone, userObject, (err) => {
                    if(!err) {
                        callback(200);
                    } else {
                        console.log(err);
                        callback(500,{'Error' : 'A user that phone number already exists'})
                    }
                })
                } else {
                    callback(500, {'Error' : 'Error'})
                }
            
            } else {
                //User already exists
                callback(400, {'Error' : 'user with phone number already exist'})
            }
        });
    } else {
        callback(400, {'Error': 'Missing required fields'})
    }
}


// Users - get
// Required data: phone
// Optional data: none
// @TODO Authenticated user access their object Only.
handlers._users.get = (data, callback) => {
    // Check that the phone number is valid
    let phone =  typeof(data.queryStringObj.phone) == 'string' && data.queryStringObj.phone.trim().length == 10 ? data.queryStringObj.phone.trim() : false;
    if(phone) {
         // Look the user
         _data.read('users', phone, (err, data) => {
             if(!err && data) {
                // Remove the hashed password 
                delete data.hashedPassword;
                callback(200,data)

             } else {
                 callback(404)
             }
         })
    } else {
        callback(400,{'Error' : 'Missing required field'});
    }
}

handlers._users.put = (data, callback) => {

}

handlers._users.delete = (data, callback) => {

}


// Define a request router
const router = {
    'ping' : handlers.ping
};

module.exports = handlers