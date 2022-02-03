import "./ManageNote.css";
import { useEffect, useState } from "react";
import { TwitterPicker } from "react-color";
import Modal from "react-modal";

import { supabaseClient } from "../../supaClient";

const customStyles = {
    content: {
        display: "flex",
        flexDirection: "column",
        top: "50%",
        left: "50%",
        right: "auto",
        bottom: "auto",
        marginRight: "-50%",
        transform: "translate(-50%, -50%)",
    },
};

Modal.setAppElement(document.getElementById("root"));

const ManageNote = ({ isOpen, onClose, initialRef, note, setNote }) => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [color, setColor] = useState("");
    const [isLoading, setIsLoading] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        if (note) {
            setTitle(note.title);
            setDescription(note.description);
            setColor(note.color);
        }
    }, [note]);

    const submitHandler = async (event) => {
        event.preventDefault();
        setErrorMessage("");
        if (description.length <= 10) {
            setErrorMessage("Description must have more than 10 characters");
            return;
        }
        setIsLoading(true);
        const user = supabaseClient.auth.user();
        let supabaseError;
        if (note) {
            const { error } = await supabaseClient
                .from("notes")
                .update({ title, description, color, user_id: user.id })
                .eq("id", note.id);
            supabaseError = error;
        } else {
            const { error } = await supabaseClient
                .from("notes")
                .insert([{ title, description, color, user_id: user.id }]);
            supabaseError = error;
        }
        setIsLoading(true);
        if (supabaseError) {
            setErrorMessage(supabaseError.message);
        } else {
            closeHandler();
        }
    };

    const closeHandler = () => {
        setTitle("");
        setDescription("");
        setColor("");
        setNote(null);
        onClose();
    };

    const handleChangeComplete = (color) => {
        setColor(color.hex);
    };

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onClose}
            style={customStyles}
            contentLabel="Payment Modal 1"
            shouldCloseOnOverlayClick={true}
        >
            <form onSubmit={submitHandler} className="note-form">
                <div className="note-form_header">
                    <h1>{note ? "Update Note" : "Add Note"}</h1>
                </div>

                <div className="note-form_body">
                    {errorMessage && (
                        <div className="note-form_error">
                            <p>{errorMessage}</p>
                        </div>
                    )}

                    <div className="note-form_body_input-container">
                        <label htmlFor="title">Title</label>
                        <input
                            name="title"
                            ref={initialRef}
                            placeholder="Add your title here"
                            onChange={(event) => setTitle(event.target.value)}
                            value={title}
                            required
                        />
                    </div>

                    <div className="note-form_body_input-container">
                        <label htmlFor="description">Description</label>
                        <textarea
                            name="description"
                            placeholder="Add your description here"
                            onChange={(event) =>
                                setDescription(event.target.value)
                            }
                            value={description}
                            required
                        />
                    </div>
                    <p>Description must have more than 10 characters.</p>
                </div>

                <div className="note-form_colors">
                    <TwitterPicker
                        color={color}
                        onChangeComplete={handleChangeComplete}
                    />
                </div>

                <div className="note-form_btn-container">
                    <button onClick={closeHandler} type="reset">
                        Cancel
                    </button>
                    <button type="submit">{note ? "Update" : "Save"}</button>
                </div>
            </form>
        </Modal>
    );
};

export default ManageNote;
