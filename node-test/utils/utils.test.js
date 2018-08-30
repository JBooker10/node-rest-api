const utils = require('./utils');

it('should add two numbers', () => {
    var res = utils.add(33, 11);
    if( res!== 44) {
        throw new Error(`Expected 44, but got ${res}`)
    }
});


it('should square a number', () => {
    var res = utils.square(8, 8);
    if( res !== 64) {
        throw new Error(`Expected 44, but got ${res}`)
    }
});

