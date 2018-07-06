
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


//@POST Request
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


// @GET Request
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


// @PUT Request
// Required data : phone
// Optional data: firstName, lastName, password 
// @TODO User Authenication Update Only
handlers._users.put = (data, callback) => {
    // Check for the required field
    let phone =  typeof(data.payload.phone) == 'string' && data.payload.phone.trim().length == 10 ? data.payload.phone.trim() : false;

    // Check for the optional fields
    let firstName = typeof(data.payload.firstName) == 'string' && data.payload.firstName.trim().length > 0 ? data.payload.firstName.trim() : false;
    let lastName = typeof(data.payload.lastName) == 'string' && data.payload.lastName.trim().length > 0 ? data.payload.lastName.trim() : false;
    let password = typeof(data.payload.password) == 'string' && data.payload.password.trim().length > 0 ? data.payload.password.trim() : false;

    if(phone) {
        if(firstName || lastName || password ) {
            _data.read('users', phone, (err,userData) => {
                if(!err && userData) {
                    if(firstName) {
                        userData.firstName = firstName;
                    }

                    if(lastName) {
                        userData.lastName = lastName;
                    }

                    if(password) {
                        userData.hashedPassword = helpers.hash(password)
                    }

                    _data.update('users', phone, userData, (err) => {
                        if(!err) {
                            callback(200);
                        } else {
                            console.log(err);
                            callback(500, {'Error' : 'Could not update the user. '})
                        }
                    });
                } else {
                    callback(400, {'Error' : 'Specified user does not exist'});
                }
            });
        } else {
            callback(400, {'Error' : "Missing fields to update"});
        } 
    } else {
        callback(400, {'Error' : 'Missing required field.'});
    }
  


}

// @DELETE Request
// Required data : phone
// @TODO User Authentication Delete Only
// @TODO Cleanup (delete)
handlers._users.delete = (data, callback) => {
    // Check valid phone number
    let phone =  typeof(data.queryStringObj.phone) == 'string' && data.queryStringObj.phone.trim().length == 10 ? data.queryStringObj.phone.trim() : false;
    if(phone) {
         // Look the user
         _data.read('users', phone, (err, data) => {
             if(!err && data) {
               _data.delete('users',phone, (err) => {
                if(!err){
                    callback(200)
                } else {
                    callback(500, {'Error' : 'Could not find the specified user'})
                }
               })
             } else {
                 callback(400, {'Error' : 'Could not find specified user'})
             }
         })
    } else {
        callback(400,{'Error' : 'Missing required field'});
    }
}


// Define a request router
const router = {
    'ping' : handlers.ping
};

module.exports = handlers