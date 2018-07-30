const fs = require('fs');

const fetchNotes = () => {
    try {
        // readFile notes-data.json in directory notes and  return the parsed JSON
            let notesString = fs.readFileSync('notes/notes-data.json')
            return JSON.parse(notesString)
        } catch (e) {
        // catch any errors if json file is not created then returns empty array
           return [];
        }
}

const saveNotes = (notes) => {
    fs.writeFileSync('notes/notes-data.json', JSON.stringify(notes) )
}


// Adds a note to json file
const addNote = (title, body) => {
    let notes = fetchNotes();
    let note = {
        title,
        body
    }

    // filter the notes to see if their are duplicates
    let duplicateNotes = notes.filter(note => note.title === title)

    // if no duplicates found then add note to the notes array
    if(duplicateNotes.length === 0) {
        notes.push(note);
        saveNotes(notes);
        return note;
    }
}

// Retreives all notes from json file
const getAll = (title) => {
   return fetchNotes();
}

// Gets note from json file
const getNote = (title) => {
    let notes = fetchNotes();

    let filteredNotes = notes.filter(note => note.title === title);
    return filteredNotes[0];
}

// Remove note from json file
const removeNote = (title) => {
    // fetch notes
    let notes = fetchNotes();
    // filter notes, remove title of argument
    let filteredNotes = notes.filter(note => note.title !== title);
    saveNotes(filteredNotes);

    return notes.length !== filteredNotes.length;
}

const logNote = (note) => {
    // Break on this line and use repl to output note
    console.log('----');
    console.log(`Title: ${note.title}`)
    console.log(`Body: ${note.body}`);
}

module.exports = {
    addNote: addNote,
    getAll: getAll,
    getNote: getNote,
    removeNote: removeNote,
    logNote: logNote
}

