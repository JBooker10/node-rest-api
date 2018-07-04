
// Request Handlers


const handlers = {};

handlers.users = function(data,callback) {
    let acceptableMethods = ['post', 'get', 'put', 'delete'];
    if(acceptableMethods.indexOf(data.HTTPmethod) > -1) {
        handlers._users[data.HTTPmethod][data,callback]
    } else {
        callback(405)
    }
}

handlers._users = {};


//@POST request
// firstName, lastName, phone, password, tosAgreement
handlers._users.post = (data, callback) => {
    //Check that all required fields are filled out
    let firstName = typeof(data.payload.firstName) == 'string' && data.payload.firstName.trim().length > 0 ?
    data.payload.firstName.trim() : false
    let lastName = typeof(data.payload.lastName) == 'string' && data.payload.firstName.trim().length > 0 ?
    data.payload.lastName.trim() : false
    let phone = typeof(data.payload.phone) == 'string' && data.payload.phone.trim().length > 10 ?
    data.payload.phone.trim() : false
    let password = typeof(data.payload.password) == 'string' && data.payload.password.trim().length > 0 ?
    data.payload.password.trim() : false
    let tosAgreement = typeof(data.payload.tosAgreement) == 'boolean' && data.payload.tosAgreement == true ?
    true : false

    if(firstname && lastName && phone && password && tosAgreement) {
        // Make sure that the user doesn't already exist
        
    } else {
        callback(400, {'Error': 'Missing required fields'})
    }
}

handlers._users.get = (data, callback) => {

}

handlers._users.put = (data, callback) => {

}

handlers._users.delete = (data, callback) => {

}

// Not found handler
handlers.notFound = (data, callback) => {
    callback(404)
};

handlers.ping = (data, callback) => {
    callback(200)
};

// Define a request router
const router = {
    'ping' : handlers.ping
};

module.exports = handlers