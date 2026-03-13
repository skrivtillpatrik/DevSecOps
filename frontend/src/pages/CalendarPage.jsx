import { useState, useEffect } from "react";
import { getMyCalendarEvents, getMemberCalendarEvents } from "../api.js";
import CreateCalendarEvent from "../components/CreateCalendarEvent";
import CalendarAgenda from "../components/CalendarAgenda.jsx";
import { useUser } from "../context/UserContext";

export default function CalendarPage() {
  const [events, setEvents] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const { user } = useUser();

  async function loadEvents() {
    const [myEvents, memberEvents] = await Promise.all([
      getMyCalendarEvents(),
      getMemberCalendarEvents()
    ]);

    // Slå ihop och sortera efter starttid om du vill
    const allEvents = [...myEvents, ...memberEvents];

    setEvents(allEvents);
  }

useEffect(() => {

  loadEvents();
}, []);

  return (
    <div>
      <h1>Din kalender</h1>

      <button onClick={() => setShowForm(prev => !prev)}>
        {showForm ? "Stäng formulär" : "Skapa nytt event"}
      </button>

      {showForm && (
        <div style={{ marginTop: "1rem" }}>
          <CreateCalendarEvent
            onCreated={() => {
              setShowForm(false);
              loadEvents(); // uppdatera listan
            }}
          />
        </div>
      )}

      <div>
        <CalendarAgenda events={events} currentUserId={user?.id} />
      </div>
    </div>
  );
}