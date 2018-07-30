// Node Core Modules
const fs = require('fs');

// NPM Third-party Modules
const _ = require('lodash');
const yargs = require('yargs');

// Modules 
const notes = require('./notes');

const titleOptions = {
    describe: 'Title of note',
    demand: true,
    alias: 't'
}

const bodyOptions =  {
    describe: 'Body of note',
    demand: true,
    alias: 'b'
 }
//Yargs helps you build interactive command line tools, by parsing arguments and generating an elegant user interface.
const argv = yargs.command('add', 'Add a new note', {
    title: titleOptions,
    body: bodyOptions
})
.command('list', 'List all notes')
.command('read', 'Read a note', {
    title: titleOptions
})
.command('remove', 'Remove a notes', {
    title: titleOptions
})
.help()
.argv;

const command = argv._[0];

// GLOBAL
console.log(process.argv)

if( command === 'add') {

    let note = notes.addNote(argv.title, argv.body)
    notes.logNote(note)

} else if ( command === 'list') {
    let allNotes = notes.getAll(argv.title)
    console.log(`Printing ${allNotes.length} note(s).`)
    allNotes.forEach(note => notes.logNote(note))

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

