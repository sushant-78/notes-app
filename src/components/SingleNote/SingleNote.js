import "./SingleNote.css";
import { TrashIcon } from "@heroicons/react/outline";

const SingleNote = ({ note, openHandler, deleteHandler, isdeleteloading }) => {
    const getDateInMonthDayYear = (date) => {
        const d = new Date(date);
        const options = {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "numeric",
            minute: "numeric",
        };
        const n = d.toLocaleDateString("en-US", options);
        const replace = n.replace(new RegExp(",", "g"), " ");
        return replace;
    };

    return (
        <section className="note" onClick={() => openHandler(note)}>
            <div className="note_info">
                <span
                    className="note_color"
                    style={{ backgroundColor: note.color }}
                ></span>
                <TrashIcon
                    className="note_delete-icon"
                    isdisabled={isdeleteloading}
                    onClick={(event) => {
                        event.stopPropagation();
                        deleteHandler(note.id);
                    }}
                />
            </div>

            <header className="note_title">
                <h3>{note.title}</h3>
                <p className="note_created-at">
                    {getDateInMonthDayYear(note.inserted_at)}
                </p>
                <p className="note_created-at">
                    {getDateInMonthDayYear(note.updated_at)}
                </p>
            </header>

            <div className="note_description">{note.description}</div>
        </section>
    );
};

export default SingleNote;
