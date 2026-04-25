import { useEffect, useState } from "react";
import { getUsers, createCalendarEvent } from "../api.js";

export default function CreateCalendarEvent({ onCreated }) {
  const [users, setUsers] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dateStart, setDateStart] = useState("");
  const [dateEnd, setDateEnd] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [status, setStatus] = useState("");

  // Hämta användare när sidan laddas
  useEffect(() => {
    getUsers()
      .then(data => setUsers(data))
      .catch(err => console.error("Kunde inte hämta användare:", err));
  }, []);

  function toggleUser(userId) {
    setSelectedUsers(prev =>
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const eventData = {
      title,
      description,
      dateStart: new Date(dateStart).toISOString().slice(0, 19).replace("T", " "),
      dateEnd: new Date(dateEnd).toISOString().slice(0, 19).replace("T", " "),
      participants: selectedUsers
    };

    try {
      await createCalendarEvent(eventData);
      setStatus("Event skapat!");
      // Rensa formuläret
      setTitle("");
      setDescription("");
      setDateStart("");
      setDateEnd("");
      setSelectedUsers([]);
      onCreated?.();
    } catch (err) {
      console.error(err);
      setStatus("Kunde inte skapa event");
    }
  }

  return (
    <div>
      <h2>Skapa nytt kalender-event</h2>

      <form onSubmit={handleSubmit}>
        <div>
          <label>Titel</label><br />
          <input
            name="title"
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Starttid</label><br />
          <input
            name="datestart"
            type="datetime-local"
            value={dateStart}
            onChange={e => setDateStart(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Sluttid</label><br />
          <input
            name="dateend"
            type="datetime-local"
            value={dateEnd}
            onChange={e => setDateEnd(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Beskrivning</label><br />
          <textarea
            name="description"
            value={description}
            onChange={e => setDescription(e.target.value)}
          />
        </div>

        <div>
          <label>Bjud in deltagare</label>
          <ul style={{ listStyle: "none", padding: 0 }}>
            {users.map(user => (
              <li key={user.id}>
                <label>
                  <input
                    type="checkbox"
                    checked={selectedUsers.includes(user.id)}
                    onChange={() => toggleUser(user.id)}
                  />
                  {user.name}
                </label>
              </li>
            ))}
          </ul>
        </div>

        <button type="submit">Skapa event</button>
      </form>

      {status && <p>{status}</p>}
    </div>
  );
}