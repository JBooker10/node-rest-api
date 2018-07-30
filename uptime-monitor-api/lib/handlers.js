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

// Users
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
handlers._users.get = (data, callback) => {
    // Check that the phone number is valid
    let phone =  typeof(data.queryStringObj.phone) == 'string' && data.queryStringObj.phone.trim().length == 10 ? data.queryStringObj.phone.trim() : false;
    if(phone) {
        // Get the token from the headers
        let token = typeof(data.headers.token) == 'string' ? data.headers.token : false;
        // Verify give token is valid for phone
        handlers._tokens.verifyToken(token, phone, (tokenIsValid) => {
            if(tokenIsValid) {
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
                callback(403, {'Error' : 'Missing required token in header, or token is invalid'})
            }
        })
         
    } else {
        callback(400,{'Error' : 'Missing required field'});
    }
}


// @PUT Request
// Required data : phone
// Optional data: firstName, lastName, password 

handlers._users.put = (data, callback) => {
    // Check for the required field
    let phone =  typeof(data.payload.phone) == 'string' && data.payload.phone.trim().length == 10 ? data.payload.phone.trim() : false;

    // Check for the optional fields
    let firstName = typeof(data.payload.firstName) == 'string' && data.payload.firstName.trim().length > 0 ? data.payload.firstName.trim() : false;
    let lastName = typeof(data.payload.lastName) == 'string' && data.payload.lastName.trim().length > 0 ? data.payload.lastName.trim() : false;
    let password = typeof(data.payload.password) == 'string' && data.payload.password.trim().length > 0 ? data.payload.password.trim() : false;

    if(phone) {
        if(firstName || lastName || password ) {

            let token = typeof(data.headers.token) == 'string' ? data.headers.token : false;
            
            handlers._tokens.verifyToken(token, phone, (tokenIsValid) => {
                if(tokenIsValid) { 
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
                    callback(403, {'Error' : 'Missing required token in header, or token is invalid'})
                }
            
            })
           
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

    let token = typeof(data.headers.token) == 'string' ? data.headers.token : false;
            
    handlers._tokens.verifyToken(token, phone, (tokenIsValid) => {
        if(tokenIsValid) { 
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
            callback(403, {'Error' : 'Missing required token in header, or token is invalid'})
        }
    });
    if(phone) {
       
    } else {
        callback(400,{'Error' : 'Missing required field'});
    }
}


handlers.tokens = (data,callback) => {
    let acceptableMethods = ['post', 'get', 'put', 'delete'];
    if(acceptableMethods.indexOf(data.HTTPmethod) > -1) {
        handlers._tokens[data.HTTPmethod](data,callback);
    } else {
        callback(405)
        console.log(data.HTTPmethod)
    }
}

// Container for all the tokens methods
handlers._tokens = {};

// Tokens - post
// Required data: phone, password
// Optional data: none
handlers._tokens.post = (data, callback) => {
    let phone =  typeof(data.payload.phone) == 'string' && data.payload.phone.trim().length == 10 ? data.payload.phone.trim() : false;
    let password = typeof(data.payload.password) == 'string' && data.payload.password.trim().length > 0 ? data.payload.password.trim() : false;

    if(phone && password) {
        // Lookup the user who matched that phone number
        _data.read('users', phone, (err, userData) => {
            if(!err && userData) {
                // Hash the sent password
                let hashedPassword = helpers.hash(password)
                if(hashedPassword == userData.hashedPassword){
                // If valid, create a new token with a random name. Exp Data with 1hr in the future
                    let tokenId = helpers.createRandomString(20);
                    let expires = Date.now() + 1000 * 60 * 60;
                    let tokenObject = {
                        'phone' : phone,
                        'id' : tokenId,
                        'expires' : expires
                    };

                    // Store the token
                    _data.create('tokens', tokenId, tokenObject, (err) => {
                        if(!err) {
                            callback(200, tokenObject);
                        } else {
                            callback(500, {'Error' : 'Could not create the new token'})
                        }
                    })
                } else { 
                    callback(400, {'Error' : 'Password did not match the specified user\'s'})
                }
            } else {
                callback(400, {'Error' : 'Could not find the specified user'})
            }
        })
    } else {
        callback(400, {'Error' : 'Missing required field(s)'})
    }
};

//Tokens GET Request
//Required data : id
//Optional data:  none
handlers._tokens.get = (data, callback) => {
    // Check that id sent is valid
    let id =  typeof(data.queryStringObj.id) == 'string' && data.queryStringObj.id.trim().length == 20 ? data.queryStringObj.id.trim() : false;
    if(id) {
         // Look the user
         _data.read('tokens', id, (err, tokenData) => {
             if(!err && tokenData) {
                 callback(200, tokenData);
             } else {
                 callback(400, {'Error' : 'Could not find specified user'});
             }
         })
    } else {
        callback(400,{'Error' : 'Missing required field'});
    }
};

// Tokens - PUT
// Required data: id, extend
handlers._tokens.put = (data, callback) => {
    let id =  typeof(data.payload.id) == 'string' && data.payload.id.trim().length == 20 ? data.payload.id.trim() : false;
    let extend =  typeof(data.payload.extend) == 'boolean' && data.payload.extend == true ? true : false;

    if(id && extend) {
        // Lookup the token
        _data.read('tokens', id, (err, tokenData) => {
            if(!err && tokenData) {
                // Check to the make sure the token isnt aready expired
                if(tokenData.expires > Date.now()) {
                    tokenData.expires = Date.now() + 1000 * 60 * 60;

                    _data.update('tokens', id, tokenData, (err) => {
                        if(!err) {
                            callback(200)
                        } else {
                            callback(500,{'Error' : "Could not update the token's expirations "})
                        }
                    })
                } else {
                    callback(400, {'Error' : 'The token has already expried, and cant be extended'})
                }
            } else {
                callback(400, {'Error' :'Specified token does not exist'})
            }
        }) 
    } else {
        callback(400, {'Error' : "Missing required field(s) or field(s) are invalid"})
    }

};


// // Tokens - delete
// // Required data: id
// // Optional data: none
// handlers._tokens.delete = (data, callback) => {
//      // Check valid Id
//      let id =  typeof(data.queryStringObj.id) == 'string' && data.queryStringObj.id.trim().length == 20 ? data.queryStringObj.id.trim() : false;
//      if(id) {
//           // Look the user
//           _data.read('tokens', id, (err, data) => {
//               if(!err && data) {
//                 _data.delete('tokens',id, (err) => {
//                  if(!err){
//                      callback(200)
//                  } else {
//                      callback(500, {'Error' : 'Could not find the specified token'})
//                  }
//                 })
//               } else {
//                   callback(400, {'Error' : 'Could not find specified token'})
//               }
//           })
//      } else {
//          callback(400,{'Error' : 'Missing required field'});
//      }
// };


// // Verify if a token id is currently valid for a given user
// handlers._tokens.verifyToken = (id, phone, callback) => {
//     // Lookup the token
//     _data.read('tokens', id, (err, tokenData) => {
//         if(!err && tokenData) {
//             // Check that the token is for the given user and has not expired
//             if(tokenData.phone == phone && tokenData.expires > Date.now()) {
//                 callback(true);
//             } else {
//                 callback(false);
//             }
//         } else {
//             callback(false)
//         }
//     })
// }


// handlers.checks = (data,callback) => {
//     let acceptableMethods = ['post', 'get', 'put', 'delete'];
//     if(acceptableMethods.indexOf(data.HTTPmethod) > -1) {
//         handlers._checks[data.HTTPmethod](data,callback);
//     } else {
//         callback(405)
//         console.log(data.HTTPmethod)
//     }
// }


// handlers._checks = {};

// handlers._checks.post = function(data,callback){
//   // Validate inputs
//   var protocol = typeof(data.payload.protocol) == 'string' && ['https','http'].indexOf(data.payload.protocol) > -1 ? data.payload.protocol : false;
//   var url = typeof(data.payload.url) == 'string' && data.payload.url.trim().length > 0 ? data.payload.url.trim() : false;
//   var method = typeof(data.payload.method) == 'string' && ['post','get','put','delete'].indexOf(data.payload.method) > -1 ? data.payload.method : false;
//   var successCodes = typeof(data.payload.successCodes) == 'object' && data.payload.successCodes instanceof Array && data.payload.successCodes.length > 0 ? data.payload.successCodes : false;
//   var timeoutSeconds = typeof(data.payload.timeoutSeconds) == 'number' && data.payload.timeoutSeconds % 1 === 0 && data.payload.timeoutSeconds >= 1 && data.payload.timeoutSeconds <= 5 ? data.payload.timeoutSeconds : false;
//   if(protocol && url && method && successCodes && timeoutSeconds){

//     // Get token from headers
//     var token = typeof(data.headers.token) == 'string' ? data.headers.token : false;

//     // Lookup the user phone by reading the token
//     _data.read('tokens',token,function(err,tokenData){
//       if(!err && tokenData){
//         var userPhone = tokenData.phone;

//         // Lookup the user data
//         _data.read('users',userPhone,function(err,userData){
//           if(!err && userData){
//             var userChecks = typeof(userData.checks) == 'object' && userData.checks instanceof Array ? userData.checks : [];
//             // Verify that user has less than the number of max-checks per user
//             if(userChecks.length < config.maxChecks){
//               // Create random id for check
//               var checkId = helpers.createRandomString(20);

//               // Create check object including userPhone
//               var checkObject = {
//                 'id' : checkId,
//                 'userPhone' : userPhone,
//                 'protocol' : protocol,
//                 'url' : url,
//                 'method' : method,
//                 'successCodes' : successCodes,
//                 'timeoutSeconds' : timeoutSeconds
//               };

//               // Save the object
//               _data.create('checks',checkId,checkObject,function(err){
//                 if(!err){
//                   // Add check id to the user's object
//                   userData.checks = userChecks;
//                   userData.checks.push(checkId);

//                   // Save the new user data
//                   _data.update('users',userPhone,userData,function(err){
//                     if(!err){
//                       // Return the data about the new check
//                       callback(200,checkObject);
//                     } else {
//                       callback(500,{'Error' : 'Could not update the user with the new check.'});
//                     }
//                   });
//                 } else {
//                   callback(500,{'Error' : 'Could not create the new check'});
//                 }
//               });



//             } else {
//               callback(400,{'Error' : 'The user already has the maximum number of checks ('+config.maxChecks+').'})
//             }


//           } else {
//             callback(403);
//           }
//         });


//       } else {
//         callback(403);
//       }
//     });
//   } else {
//     callback(400,{'Error' : 'Missing required inputs, or inputs are invalid'});
//   }
// };


// Define a request router
const router = {
    'ping' : handlers.ping
};

module.exports = handlers