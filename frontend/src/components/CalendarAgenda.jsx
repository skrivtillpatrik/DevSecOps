import { useState } from "react";
import "./calendarAgenda.css";
import { deleteCalendarEvent, updateCalendarEvent } from "../api.js";

function toDateTimeLocal(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const offsetMillis = date.getTimezoneOffset() * 60000;
  return new Date(date.getTime() - offsetMillis).toISOString().slice(0, 16);
}

function toSqlDateTime(value) {
  if (!value) return "";
  return new Date(value).toISOString().slice(0, 19).replace("T", " ");
}

export default function CalendarAgenda({ events, currentUserId, onRefresh }) {
  const [editingEventId, setEditingEventId] = useState(null);
  const [editForm, setEditForm] = useState({
    title: "",
    description: "",
    dateStart: "",
    dateEnd: ""
  });

  function startEdit(ev) {
    setEditingEventId(ev.id);
    setEditForm({
      title: ev.title || "",
      description: ev.description || "",
      dateStart: toDateTimeLocal(ev.dateStart),
      dateEnd: toDateTimeLocal(ev.dateEnd)
    });
  }

  function cancelEdit() {
    setEditingEventId(null);
  }

  async function handleDelete(id) {
    if (!window.confirm("Ta bort detta event?")) return;

    try {
      await deleteCalendarEvent(id);
      onRefresh?.();
      setEditingEventId(prev => (prev === id ? null : prev));
    } catch (error) {
      console.error(error);
      window.alert("Kunde inte ta bort eventet.");
    }
  }

  async function handleUpdate(e) {
    e.preventDefault();
    if (!editingEventId) return;

    try {
      await updateCalendarEvent(editingEventId, {
        title: editForm.title,
        description: editForm.description,
        dateStart: toSqlDateTime(editForm.dateStart),
        dateEnd: toSqlDateTime(editForm.dateEnd)
      });
      setEditingEventId(null);
      onRefresh?.();
    } catch (error) {
      console.error(error);
      window.alert("Kunde inte uppdatera eventet.");
    }
  }

  return (
    <div className="agenda">
      {events.map(ev => {
        const isCreator = ev.createdBy === currentUserId;

        const isEditing = editingEventId === ev.id;

        return (
          <div key={ev.id} className={`event-card ${isCreator ? "mine" : "invited"}`}>
            {isEditing ? (
              <form className="event-edit-form" onSubmit={handleUpdate}>
                <div>
                  <label htmlFor="title">Titel</label>
                  <input
                    id="title"
                    name="title"
                    value={editForm.title}
                    onChange={e => setEditForm(prev => ({ ...prev, title: e.target.value }))}
                    required
                  />
                </div>

                <div>
                  <label htmlFor="dateStart">Starttid</label>
                  <input
                    id="dateStart"
                    name="dateStart"
                    type="datetime-local"
                    value={editForm.dateStart}
                    onChange={e => setEditForm(prev => ({ ...prev, dateStart: e.target.value }))}
                    required
                  />
                </div>

                <div>
                  <label htmlFor="dateEnd">Sluttid</label>
                  <input
                    id="dateEnd"
                    name="dateEnd"
                    type="datetime-local"
                    value={editForm.dateEnd}
                    onChange={e => setEditForm(prev => ({ ...prev, dateEnd: e.target.value }))}
                    required
                  />
                </div>

                <div>
                  <label htmlFor="description">Beskrivning</label>
                  <textarea
                    id="description"
                    name="description"
                    value={editForm.description}
                    onChange={e => setEditForm(prev => ({ ...prev, description: e.target.value }))}
                  />
                </div>

                <div className="event-actions">
                  <button type="submit">Spara</button>
                  <button type="button" onClick={cancelEdit}>
                    Avbryt
                  </button>
                </div>
              </form>
            ) : (
              <>
                <div className="event-header">
                  <strong>{ev.title}</strong>
                  <span className="event-time">
                    {ev.dateStart} → {ev.dateEnd}
                  </span>
                </div>

                {ev.description && (
                  <div className="event-description">
                    {ev.description}
                  </div>
                )}

                <div className="event-participants">
                  <strong>Deltagare:</strong>
                  <ul>
                    {ev.participantsNames.map(p => (
                      <li key={p.id}>
                        {p.name} {p.id === currentUserId ? "(du)" : ""}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="event-badge">
                  {isCreator ? "Skapad av dig" : "Du är inbjuden"}
                </div>

                {isCreator && (
                  <div className="event-actions">
                    <button name="EditEvent" type="button" onClick={() => startEdit(ev)}>
                      Uppdatera
                    </button>
                    <button name="DeleteEvent" type="button" onClick={() => handleDelete(ev.id)}>
                      Ta bort
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        );
      })}
    </div>
  );
}