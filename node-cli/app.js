// Node Core Modules
const fs = require('fs');

// NPM Third-party Modules
const _ = require('lodash');
const yargs = require('yargs');

// Modules 
const notes = require('./notes');


//Yargs helps you build interactive command line tools, by parsing arguments and generating an elegant user interface.
const argv = yargs.argv
const command = argv._[0];

// GLOBAL
console.log(process.argv)

if( command === 'add') {
    notes.addNote(argv.title, argv.body)
} else if ( command === 'list') {
    notes.getAll(argv.title)
} else if (command === 'read') {
    notes.getNote(argv.title)
} else if (command === 'remove') {
    notes.removeNote(argv.title)
} else {
    console.log('Command not recognized')
}