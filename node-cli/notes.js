const fs = require('fs');

// Adds a note to json file
const addNote = (title, body) => {
    let notes = [];
    let note = {
        title,
        body
    }

    try {
    // readFile notes-data.json in directory notes and parse 
        let notesString = fs.readFileSync('notes/notes-data.json')
        notes = JSON.parse(notesString)
    } catch (e) {
    // catch any errors if json file is not created
    }

    // filter the notes to see if their are duplicates
    let duplicateNotes = notes.filter(note => note.title === title)

    // if no duplicates found then add note to the notes array
    if(duplicateNotes.length === 0) {
        notes.push(note)
        fs.writeFileSync('notes/notes-data.json', JSON.stringify(notes) )
    }
}

// Retreives all notes from json file
const getAll = (title) => {
    console.log('retrieve all notes', title)
}

// Gets note from json file
const getNote = (title) => {
    console.log('reading note', title)
}

// Remove note from json file
const removeNote = (title) => {
    console.log('removing note', title)
}

module.exports = {
    addNote: addNote,
    getAll: getAll,
    getNote: getNote,
    removeNote: removeNote
}