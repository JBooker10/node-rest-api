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

    let note = notes.addNote(argv.title, argv.body)
    notes.logNote(note)

} else if ( command === 'list') {

    notes.getAll(argv.title)

} else if (command === 'read') {

    let note = notes.getNote(argv.title)
    notes.logNote(note)
  

} else if (command === 'remove') {

    let noteRemoved = notes.removeNote(argv.title)
    let message = noteRemoved ? 'Note was removed' : 'Note not found';
    console.log(message);

} else {
    console.log('Command not recognized')
}