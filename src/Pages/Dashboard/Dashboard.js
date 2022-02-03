import "./Dashboard.css";
import { PlusSmIcon } from "@heroicons/react/outline";

import { useEffect, useRef, useState } from "react";
import { useDisclosure } from "@chakra-ui/hooks";

import ManageNote from "../../components/ManageNote/ManageNote";
import Navbar from "../../components/Navbar/Navbar";
import SingleNote from "../../components/SingleNote/SingleNote";
import { supabaseClient } from "../../supaClient";

export function Dashboard() {
    const initialRef = useRef();
    const [notes, setNotes] = useState([]);
    const [note, setNote] = useState(null);
    const [isDeleteLoading, setIsDeleteLoading] = useState(false);

    const { isOpen, onOpen, onClose } = useDisclosure();
    const user = supabaseClient.auth.user();

    useEffect(() => {
        if (user) {
            supabaseClient
                .from("notes")
                .select("*")
                .eq("user_id", user?.id)
                .order("id", { ascending: false })
                .then(({ data, error }) => {
                    if (!error) {
                        setNotes(data);
                    }
                });
        }
    }, [user]);

    useEffect(() => {
        const notesListener = supabaseClient
            .from("notes")
            .on("*", (payload) => {
                if (payload.eventType !== "DELETE") {
                    const newNote = payload.new;
                    setNotes((oldNotes) => {
                        const exists = oldNotes.find(
                            (note) => note.id === newNote.id
                        );
                        let newNotes;
                        if (exists) {
                            const oldNoteIndex = oldNotes.findIndex(
                                (obj) => obj.id === newNote.id
                            );
                            oldNotes[oldNoteIndex] = newNote;
                            newNotes = oldNotes;
                        } else {
                            newNotes = [...oldNotes, newNote];
                        }
                        newNotes.sort((a, b) => b.id - a.id);
                        return newNotes;
                    });
                }
            })
            .subscribe();

        return () => {
            notesListener.unsubscribe();
        };
    }, []);

    const openHandler = (clickedNote) => {
        setNote(clickedNote);
        onOpen();
    };

    const deleteHandler = async (noteId) => {
        setIsDeleteLoading(true);
        const { error } = await supabaseClient
            .from("notes")
            .delete()
            .eq("id", noteId);
        if (!error) {
            setNotes(notes.filter((note) => note.id !== noteId));
        }
        setIsDeleteLoading(false);
    };

    return (
        <>
            <Navbar onOpen={onOpen} />

            <ManageNote
                isOpen={isOpen}
                onClose={onClose}
                initialRef={initialRef}
                note={note}
                setNote={setNote}
            />

            <main className="notes-container">
                <header className="notes_header">
                    <h2>your notes.</h2>
                    <PlusSmIcon
                        className="notes_add-note-icon"
                        onClick={onOpen}
                    />
                </header>
                <section className="notes">
                    {notes.map((note, index) => (
                        <SingleNote
                            note={note}
                            key={index}
                            openHandler={openHandler}
                            deleteHandler={deleteHandler}
                            isDeleteLoading={isDeleteLoading}
                        />
                    ))}
                </section>
            </main>
        </>
    );
}
