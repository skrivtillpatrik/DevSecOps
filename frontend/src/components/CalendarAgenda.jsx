import "./calendarAgenda.css";


export default function CalendarAgenda({ events, currentUserId }) {
  return (
    <div className="agenda">
      {events.map(ev => {
        const isCreator = ev.createdBy === currentUserId;

        return (
          <div key={ev.id} className={`event-card ${isCreator ? "mine" : "invited"}`}>
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
          </div>
        );
      })}
    </div>
  );
}