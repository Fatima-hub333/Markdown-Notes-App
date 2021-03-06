/* eslint-disable no-unused-vars */
/* eslint-disable react/button-has-type */
/* eslint-disable react/jsx-no-bind */
import React from 'react';
import Split from 'react-split';
import { nanoid } from 'nanoid';
import Sidebar from './components/Sidebar';
import Editor from './components/Editor';
import { data } from './data';
import 'react-mde/lib/styles/css/react-mde-all.css';
import './index.css';

export default function App() {
  const [notes, setNotes] = React.useState(
    () => JSON.parse(localStorage.getItem('notes')) || [],
  );
  const [currentNoteId, setCurrentNoteId] = React.useState(
    (notes[0] && notes[0].id) || '',
  );

  React.useEffect(() => {
    localStorage.setItem('notes', JSON.stringify(notes));
  }, [notes]);

  function createNewNote() {
    const newNote = {
      id: nanoid(),
      body: "# Type your markdown note's title here",
    };
    setNotes((prevNotes) => [newNote, ...prevNotes]);
    setCurrentNoteId(newNote.id);
  }

  function updateNote(text) {
    // Try to rearrange the most recently-modified note to be at the top
    setNotes((oldNotes) => {
      const newArray = [];
      for (let i = 0; i < oldNotes.length; i += 1) {
        const oldNote = oldNotes[i];
        if (oldNote.id === currentNoteId) {
          newArray.unshift({ ...oldNote, body: text });
        } else {
          newArray.push(oldNote);
        }
      }
      return newArray;
      // Create new empty array
      // Loop over the original array
      // if the id matches
      // put the udated note at the
      // begining of the new array
      // else
      // push the old note to the end
      // of the new array
      // return the new array
    });

    // This does not rearrange the notes
    // setNotes(oldNotes => oldNotes.map(oldNote => {
    //     return oldNote.id === currentNoteId
    //         ? { ...oldNote, body: text }
    //         : oldNote
    // }))
  }

  function deleteNote(event, noteId) {
    event.stopPropagation();
    setNotes((oldNotes) => oldNotes.filter((note) => note.id !== noteId));
  }
  function findCurrentNote() {
    return notes.find((note) => note.id === currentNoteId) || notes[0];
  }

  return (
    <main>
      {
            notes.length > 0
              ? (
                <Split
                  sizes={[30, 70]}
                  direction="horizontal"
                  className="split"
                >
                  <Sidebar
                    notes={notes}
                    currentNote={findCurrentNote()}
                    setCurrentNoteId={setCurrentNoteId}
                    newNote={createNewNote}
                    deleteNote={deleteNote}
                  />
                  {
                    currentNoteId
                    && notes.length > 0
                    && (
                    <Editor
                      currentNote={findCurrentNote()}
                      updateNote={updateNote}
                    />
                    )
                }
                </Split>
              )
              : (
                <div className="no-notes">
                  <h1>You have no notes</h1>
                  <button
                    className="first-note"
                    onClick={createNewNote}
                  >
                    Create one now
                  </button>
                </div>
              )
}
    </main>
  );
}
